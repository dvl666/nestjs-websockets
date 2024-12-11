import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Product {
        
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    title: string

    @Column('float', { default: 0 })
    price: number

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @Column('text')
    slug: string

    @Column('int', { default: 0 })
    stock: number

    @Column('text', { array: true })
    sizes: string[]

    @Column('text')
    gender: string

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @OneToMany(
        () => ProductImage,
        ( image ) => image.product,
        { cascade: true, eager: true },
    )
    images: ProductImage[]

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { onDelete: 'CASCADE' }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ) this.slug = this.title;
        this.slug = this.slug.toLowerCase().split(' ').join('_');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if ( this.slug ) this.slug = this.slug
            .toLowerCase()
            .split(' ')
            .join('_')
            .replaceAll("'", '');
    }

    @BeforeInsert()
    checkTagsInsert() {
        // this.tags.forEach( (tag) => tag.toLowerCase() ); // forEach no retorna un array solo lo itera
        if ( this.tags ) this.tags = this.tags.map( (tag) => tag.toLowerCase() ); // map retorna un array modificado
    }

}
