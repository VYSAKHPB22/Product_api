import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import path from 'path';
import { ProductsModule } from 'src/Admin/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule as userproductsModule } from 'src/User/products/products.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'admin',
            children: [
              {
                path: 'products',
                module: ProductsModule,
              },
            ],
          },

          {
            path: 'users',
            children: [
              {
                path: 'user-products',
                module: userproductsModule,
              },
            ],
          },
        ],
      },
    ]),
  ],
})
export class AppRoutesModule {}
