import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, isEnum, IsNotEmpty, IsNumber, isNumber, MinLength } from 'class-validator';
import { Roles } from 'src/constants/constants';

export class registrationDTO {
  @IsNotEmpty()
  @ApiProperty()
  user_name: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(8)
  password: string;

   @IsNotEmpty()
  @ApiProperty()
  @IsEnum(Roles)
  role:Roles
}

export class signinDTO {
  @IsNotEmpty()
  @ApiProperty()
  user_name: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(8)
  password: string;
  
   @IsNotEmpty()
  @ApiProperty()
  @IsEnum(Roles)
  role:Roles
}

export class TokenDto{
   @IsNotEmpty()
  @ApiProperty()
  refresh_token:string
}
