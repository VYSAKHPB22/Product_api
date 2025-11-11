import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/Entity/user.schema';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { JwtStrategy } from './statergy/jwt_statergy';
import { adminUserSchema } from 'src/Entity/admin-users.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:'user',schema:userSchema},
      {name:'admin-user',schema:adminUserSchema}
      
    ]),

   JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (jwtConfiguration: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfiguration.default.secret,
        signOptions: { expiresIn: jwtConfiguration.default.expiry as any, },
      }),
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
