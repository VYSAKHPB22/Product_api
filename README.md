# Product API (NestJS)

A RESTful API built using **NestJS** and **MongoDB**, implementing **JWT authentication** for user and admin roles.

## Features
- User registration and login
- Role-based access (Admin & User)
- JWT authentication (access & refresh tokens)
- CRUD operations for products(Admin)
- View created products(User)
- MongoDB connection (via Mongoose)
- Deployed on Render

## 🧩 Tech Stack
- **NestJS**
- **MongoDB (Atlas)**
- **Mongoose**
- **JWT Authentication**
- **Render Deployment**

## 🔑 Environment Variables
```env
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_SECRET_EXPIRY=
JWT_ADMIN_ACCESS_SECRET_KEY=
JWT_ADMIN_REFRESH_SECRET=
JWT_USER_ACCESS_SECRET_KEY=
JWT_USER_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_EXPIRY=