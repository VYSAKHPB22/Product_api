import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { timestamp } from 'rxjs';
import { Roles } from 'src/constants/constants';

@Schema({
  timestamps: true,
})
export class adminUsers {
  @Prop({ required: true })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @Prop({ type: String, enum: Roles,  })
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(Roles)
  role: Roles;
}

export const adminUserSchema = SchemaFactory.createForClass(adminUsers);
