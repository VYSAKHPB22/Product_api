import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { signinDTO, TokenDto } from './auth-DTO/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly usermodel: Model<any>,
     @InjectModel('admin-user') private readonly adminUsermodel: Model<any>,
    private jwtservice: JwtService,
  ) {}

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

    console.log(user)

    const payload = {
      sub: user._id,
      username: user.user_name,
      role: user.role ,
    };
    const Access_token =
      user.role === 'admin'
        ? await this.jwtservice.sign(payload, {
            secret: process.env.JWT_ADMIN_ACCESS_SECRET_KEY,
            expiresIn: Number(process.env.JWT_ACCESS_EXPIRY),
          })
        : await this.jwtservice.sign(payload, {
            secret: process.env.JWT_USER_ACCESS_SECRET_KEY,
            expiresIn: Number(process.env.JWT_ACCESS_EXPIRY),
          });

    const Refresh_token =user.role==='admin'?
    
    
    await this.jwtservice.sign(payload, {
      secret: process.env.JWT_ADMIN_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRY),
    }):
      await this.jwtservice.sign(payload, {
      secret: process.env.JWT_USER_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRY),
    })

   

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
        ? process.env.JWT_ADMIN_REFRESH_SECRET
        : process.env.JWT_USER_REFRESH_SECRET;
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
        ? process.env.JWT_ADMIN_ACCESS_SECRET_KEY
        : process.env.JWT_USER_ACCESS_SECRET_KEY;

    const newRefreshSecret =
      role === 'admin'
        ? process.env.JWT_ADMIN_REFRESH_SECRET
        : process.env.JWT_USER_REFRESH_SECRET;

    const newPayload = {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    };

    const newAccessToken = this.jwtservice.sign(newPayload, {
      secret: accessSecret,
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRY),
    });

    const newRefreshToken = this.jwtservice.sign(newPayload, {
      secret: newRefreshSecret,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRY),
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
