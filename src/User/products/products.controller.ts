import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtUserGuard } from 'src/auth/gaurds/jwt.user.gaurd';
@ApiTags('user-products')
@Controller()
@UseGuards(JwtUserGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


    @Get('get-products')
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
}
