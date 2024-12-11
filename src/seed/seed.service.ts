import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data-seed';
import { AuthService } from 'src/auth/auth.service';
import { initialDataUsers } from './data/data-user-seed';

@Injectable()
export class SeedService {

    constructor(
        private readonly productsService: ProductsService,
        private readonly authService: AuthService
    ) { }

    async seed() {
        await this.seedProducts();
        return 'SEED EXECUTED';
    }
    
    async seedProducts() {
        const adminEmail = 'gabriel.kamann@usm.cl'

        await this.authService.deleteAllUsers();
        await this.productsService.deleteAllProducts();

        const products = initialData.products;
        const users = initialDataUsers.users;

        for (const user of users) {
            await this.authService.create(user);
        }

        const admin = await this.authService.findUserByEmail(adminEmail)

        const insertPromises = [];

        products.forEach( (product) => {
            insertPromises.push( this.productsService.create( product, admin ) );
        });

        const result = await Promise.all(insertPromises);

        return result
    }

}
