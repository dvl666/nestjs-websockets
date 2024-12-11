import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  // Create a logger instance -> This will be used to log the messages
  private readonly logger = new Logger('ProductsService');

  constructor(
    
    // Inject the product repository for database operations
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource // -> Inject the DataSource to create a QueryRunner

  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    
    try {
      const { images = [], ...restData } = createProductDto
      const product = this.productRepository.create({
        ...restData,
        images: images.map( ( image ) => this.productImageRepository.create({ url: image }) ),
        user: user
      });
      // console.log(product);
      await this.productRepository.save( product );
    
      return { ...product, images };
    } catch (error) { 
      this.handleDuplicateError(error) 
    };

  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit, // take de toma
      skip: offset, // skip de salto
      relations: {
        images: true,
        user: true
      }
    });

    return products.map( ( product ) => ({
      ...product, // Este operador copia todas las propiedades del objeto product en el nuevo objeto.
      images: product.images.map( ( image ) => image.url ) // Sobrescribe la propiedad images del producto.
    }) );

  }

  //FindOneBy != FindOne
  async findOne(term: string) {

    let product: Product;

    // Validar si el término es un UUID
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
      return product
    }

    // Usar QueryBuilder para buscar por slug o título
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    product = await queryBuilder
    .select('product')
    .where('LOWER(product.title) = :slug OR LOWER(product.slug) = :title ', {
      slug: term.toLowerCase(), 
      title: term.toLowerCase() 
    }).getOne();
    
    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;

  }

  async findOnePlain(term: string) {

    const { images = [], ...restOfProduct } = await this.findOne(term);
    return {
      ...restOfProduct,
      images: images.map( ( (image) => image.url ) )
    }

  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images = [], ...restProduct } = updateProductDto;

    const product = await this.productRepository.preload({ // preload() es una función de TypeORM que carga los datos de la base de datos en la entidad
      id: id,
      ...restProduct,
      user:  user
    })

    if ( !product ) throw new NotFoundException(`Product with id ${id} not found`);

    //Create Query Runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete( ProductImage, { product: { id } } )
        product.images = images.map( ( image ) => this.productImageRepository.create({ url: image }) );
      } else {
        console.log('hola');
      }
      await queryRunner.manager.save( product );
      
      // this.productRepository.save( product ); // save() es una función de TypeORM que guarda los datos en la base de datos
      
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { 
        ...product, 
        images: product.images.map( ( image ) => image.url ) 
      };

    } catch ( error ) {

      await queryRunner.rollbackTransaction();
      this.handleDuplicateError(error)
      
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if ( !product ) throw new NotFoundException(`Product with id ${id} not found`);
    await this.productRepository.remove( product );
    return `Product with id ${id} removed`;
  }

  private handleDuplicateError(error: any) {

    if ( error.code === '23505' ) throw new BadRequestException(`error: ${error.detail}`);
    this.logger.error(error);
    throw new InternalServerErrorException('Error, please check the logs');

  }

  async deleteAllProducts() {

    const query = this.productRepository.createQueryBuilder('product');

    try {
      await query.delete().where({}).execute();
      return 'All products deleted';
    } catch (error) {
      this.handleDuplicateError(error)
    }

  }

}
