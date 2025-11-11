import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './Dto/product.dto';
import { JwtAdminGuard } from 'src/auth/gaurds/jwt.admin.gaurd';
@ApiTags('Admin-products')
@Controller()
@UseGuards(JwtAdminGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create-product')
    @ApiOperation({ summary: 'Create a product' })
    @ApiBearerAuth('access token')
  async create(@Body() dto: CreateProductDto, @Req() req):Promise<any> {
    try {
    
      dto.createdby = req.user.username;
      const result = await this.productsService.create(dto);
      return {
        message: 'Product added sucessfully',
        result: result,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('get-all-products')
    @ApiOperation({ summary: 'Getting all created product' })
     @ApiBearerAuth('access token')
  async findAll():Promise<any> {
    

    try {
      const result= await this.productsService.findAll();
      return{
        message:'Product List',
        result:result,
        statusCode:HttpStatus.OK
      }
    } catch (error) {
      throw error
      
    }
  }

  @Get('get-product/:id')
  @ApiOperation({ summary: 'Get a specific product by id' })
   @ApiBearerAuth('access token')
 async findOne(@Param('id') id: string):Promise<any> {
  try {
    const result=await this.productsService.findOne(id);
    return{
      message:'Product details',
      result:result,
      statusCode:HttpStatus.OK
    }
  } catch (error) {
    throw error
  }
    
  }

  @Put('update-product/:id')
  @ApiOperation({ summary: 'Update a specific  product' })
   @ApiBearerAuth('access token')
 async  update(@Param('id') id: string, @Body() dto: CreateProductDto,@Req()req):Promise<any> {
  try {
    dto.updatedby=req.user.username
    const result=await this.productsService.update(id,dto)
    return {
      message:'Product Updated ',
      result:result,
      statusCode:HttpStatus.OK
    }
  } catch (error) {
    throw error
    
  }
   
  }

  @Delete('delete-product/:id')
  @ApiOperation({ summary: 'Deleting a specific products' })
   @ApiBearerAuth('access token')
  async delete(@Param('id') id: string,) {
    try {
      const result=await this.productsService.Delete(id)
      return {
        message:'Product deleted sucessfully',
        result:'Deleted',
        statusCode:HttpStatus.OK
      }
    } catch (error) {
      throw error
      
    }
   
  }
}
