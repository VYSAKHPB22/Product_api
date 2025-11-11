import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  admin: {
    access_secret: process.env.JWT_ADMIN_ACCESS_SECRET_KEY,
    refresh_secret: process.env.JWT_ADMIN_REFRESH_SECRET,
  
  },

  user: {
    access_secret: process.env.JWT_USER_ACCESS_SECRET_KEY,
    refresh_secret: process.env.JWT_USER_REFRESH_SECRET,

  },
  expires: {
    access: process.env.JWT_ACCESS_EXPIRY,
    refresh: process.env.JWT_REFRESH_EXPIRY,
  },

  default:{
    secret: process.env.JWT_SECRET,
    expiry:process.env.JWT_SECRET_EXPIRY
  }
}));
