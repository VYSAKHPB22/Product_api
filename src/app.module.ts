import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';

import jwtConfig from './auth/config/jwt.config';
import { AppRoutesModule } from './Routes/roter module/app-routes.module';
import { ProductsModule } from './User/products/products.module';
import { ProductsModule as userproductsModule } from './Admin/products/products.module';



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true, load: [jwtConfig]}),
 MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), 
      }),
    }),
  
    AuthModule,AppRoutesModule,ProductsModule,userproductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
