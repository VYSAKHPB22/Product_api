import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interface/jwt.payload.interface';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(  @Inject(jwtConfig.KEY)
      private jwtConfiguration: ConfigType<typeof jwtConfig>,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      secretOrKeyProvider: (request, rawJwtToken, done) => {
        try {
          const decoded: any = JSON.parse(
            Buffer.from(rawJwtToken.split('.')[1], 'base64').toString(),
            
          );
        

          const role = decoded.role;

          const SECRETS = {
            admin:this.jwtConfiguration.admin.access_secret,
            user:this.jwtConfiguration.user.access_secret,
          };

          const secret = SECRETS[role] || process.env.JWT_SECRET;
     

          if (!secret) {
            return done(new UnauthorizedException('Invalid role or secret'));
          }

          return done(null, secret);
        } catch (err) {
       
          return done(new UnauthorizedException('Invalid token'));
        }
      },
    });
  }

  async validate(payload: JwtPayload) {
    console.log('payload', payload);
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
