import { Body, Controller, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { registrationDTO, signinDTO, TokenDto } from './auth-DTO/auth.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-user')
  @ApiOperation({ summary: 'registration of the main user in db (Roles:[admin,user] only)' })
  async registeruser(@Body(ValidationPipe) registerationDTO: registrationDTO): Promise<any> {
    try {
      const result = await this.authService.userRegistration(registerationDTO);
      return {
        message: 'User registerd sucessfully',
        result: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }


   @Post('login-user')
  @ApiOperation({ summary: 'log-in of the registerd user' })
  async signin(@Body(ValidationPipe) signindto: signinDTO) {

   try {
     const result=await this.authService.usersignin(signindto);
   
     return{
      message:'user logged in successfully',
      result:result,
      statusCode:HttpStatus.OK
     }
   } catch (error) {
    
    throw error
   }
  }

  
   @Post('refresh-token')
  @ApiOperation({ summary: 'Refreshing point  of tokens' })
  async  RefreshToken(@Body(ValidationPipe) TokenDto:TokenDto ) {

   try {
     const result=await this.authService.refreshTokens(TokenDto);
     return{
      message:'Token Refreshed Sucessfully',
      result:result,
      statusCode:HttpStatus.OK
     }
   } catch (error) {
    
    throw error
   }
  }
}
