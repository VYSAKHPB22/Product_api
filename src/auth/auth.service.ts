import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { signinDTO, TokenDto } from './auth-DTO/auth.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly usermodel: Model<any>,
     @InjectModel('admin-user') private readonly adminUsermodel: Model<any>,
     @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private jwtservice: JwtService,
  ) {}

  //user registration
  async userRegistration(registrationdto): Promise<any> {
    const { user_name, email, phone_number, password,role } = registrationdto;
      const model = role === 'user' ? this.usermodel : this.adminUsermodel;
    const checkuser = await model.findOne({ user_name });
    if (checkuser) {
      throw new ConflictException('user  is already registerd ');
    }

    const hashpassword = await bcrypt.hash(password, 8);
  
    const userDetails = await model.create({
      user_name,
      password: hashpassword,
      role
    });
    return userDetails;
  }

  //user signin
  async usersignin(signindto: signinDTO) {
    const { user_name, password,role } = signindto;
      const model = role === 'user' ? this.usermodel : this.adminUsermodel;

    const user = await model.findOne({ user_name });

    if (!user) {
      throw new UnauthorizedException('invalid details');
    }
    const passwordmatch = await bcrypt.compare(password, user.password);
    if (!passwordmatch) {
      throw new UnauthorizedException('invalid details');
    }

  

    const payload = {
      sub: user._id,
      username: user.user_name,
      role: user.role ,
    };

    console.log('SIGN role:', user.role);

    const Access_token =
      user.role === 'admin'
        ? await this.jwtservice.sign(payload, {
            secret: this.jwtConfiguration.admin.access_secret,
            expiresIn: Number(this.jwtConfiguration.expires.access),
          })
        : await this.jwtservice.sign(payload, {
            secret: this.jwtConfiguration.user.access_secret,
            expiresIn: Number(this.jwtConfiguration.expires.access),
          });

         

    const Refresh_token =user.role==='admin'?
    
    
    await this.jwtservice.sign(payload, {
      secret: this.jwtConfiguration.admin.refresh_secret,
      expiresIn: Number(this.jwtConfiguration.expires.refresh),
    }):
      await this.jwtservice.sign(payload, {
      secret: this.jwtConfiguration.user.refresh_secret,
      expiresIn: Number(this.jwtConfiguration.expires.refresh),
    })

 
console.log('secret',this.jwtConfiguration.admin.access_secret);

    return { Access_token: Access_token, Refresh_token: Refresh_token };
  }

  async refreshTokens(TokenDto: TokenDto) {
    const { refresh_token } = TokenDto;
    const decoded: any = JSON.parse(
      Buffer.from(refresh_token.split('.')[1], 'base64').toString(),
    );
    if (!decoded) {
      throw new UnauthorizedException('invalid  token');
    }
    console.log(decoded);

    const role = decoded.role;

    const refreshSecret =
      role === 'admin'
        ? this.jwtConfiguration.admin.refresh_secret
        : this.jwtConfiguration.user.refresh_secret;
let payload
  try {
   payload = this.jwtservice.verify(refresh_token, {
      secret: refreshSecret,
    });
  } catch (error) {
    throw new UnauthorizedException('invalid or malformed refresh token');
  }

    const accessSecret =
      role === 'admin'
        ? this.jwtConfiguration.admin.access_secret
        : this.jwtConfiguration.user.access_secret;

    const newRefreshSecret =
      role === 'admin'
        ? this.jwtConfiguration.admin.refresh_secret
        : this.jwtConfiguration.user.refresh_secret;


    const newPayload = {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    };

    const newAccessToken = this.jwtservice.sign(newPayload, {
      secret: accessSecret,
      expiresIn: Number(this.jwtConfiguration.expires.access
),
    });

    const newRefreshToken = this.jwtservice.sign(newPayload, {
      secret: newRefreshSecret,
      expiresIn: Number(this.jwtConfiguration.expires.refresh),
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
