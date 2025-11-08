import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './Dto/product.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('products') private readonly productsmodel: Model<any>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = await new this.productsmodel(dto);
    if (!product) {
      throw new BadRequestException('error while creating product');
    }
    return product.save();
  }

  async findAll() {
    const result = await this.productsmodel.find().lean();

    if (!result) {
      throw new BadRequestException('error while fetching all products');
    }
    return result;
  }

  async findOne(id: string) {
    const result = await this.productsmodel.findById(new Types.ObjectId(id));
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }

  async update(id: string, dto: CreateProductDto) {
    const product = await this.productsmodel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async Delete(id: string) {
    const product = await this.productsmodel.findByIdAndDelete(id);
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
