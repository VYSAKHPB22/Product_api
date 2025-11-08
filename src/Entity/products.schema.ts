import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
})
export class products {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty()
  @Prop({ required: true })
  category: string;

  @ApiProperty()
  @Prop({ type: String, })
  createdby: string;

    @ApiProperty()
  @Prop({ type: String,  default:null})
  updatedby: string;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;
}

export const  productSchema=SchemaFactory.createForClass(products);