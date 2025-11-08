import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interface/jwt.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor() {
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
            admin: process.env.JWT_ADMIN_ACCESS_SECRET_KEY,
            user: process.env.JWT_USER_ACCESS_SECRET_KEY,
 
          };

          const secret = SECRETS[role] || process.env.JWT_DEFAULT_SECRET;
          

    

          if (!secret) {
            return done(new UnauthorizedException('Invalid role or secret'));
          }

          return done(null, secret);
        } catch (err) {
          console.log('JWT Decode failed:', err); 
          return done(new UnauthorizedException('Invalid token'));
        }
      },
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
