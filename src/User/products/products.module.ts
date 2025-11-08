import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { products, productSchema } from 'src/Entity/products.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    
 MongooseModule.forFeature([{ name: 'products', schema: productSchema}]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
