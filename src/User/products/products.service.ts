import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
 constructor(
    @InjectModel('products') private readonly productsmodel: Model<any>,
  ) {}

      async findAll() {
        const result = await this.productsmodel.find().lean();
    
        if (!result) {
          throw new BadRequestException('error while fetching all products');
        }
        return result;
      }
}
