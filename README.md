# API Documentation



## Table of Contents
- [Auth Routes](#auth-routes)


## Auth Routes
- **POST /auth/login**: Login a user
- **POST /auth/logout**: Logout a user
- **GET /auth/get-me**: Retrieve the profile of the logged-in user
- **PUT /auth/change-password**: Change the password of the logged-in user
- **POST /auth/forgot-password**: Initiate password reset process
- **POST /auth/reset-password**: Complete password reset process

## User Routes
- **POST /users**: Create a new user
- **POST /users/create-admin**: Create a new admin user
- **GET /users**: Retrieve all users
- **GET /users/:id**: Retrieve a single user by ID
- **PUT /users/:id**: Update a user by ID
- **DELETE /users/:id**: Delete a user by ID


## Product Routes
- **POST /products**: Create a new product
- **GET /products**: Retrieve all products
- **GET /products/:id**: Retrieve a single product by ID
- **PUT /products/:id**: Update a product by ID
- **DELETE /products/:id**: Delete a product by ID

## Order Routes
- **POST /orders**: Create a new order
- **GET /orders**: Retrieve all orders
- **GET /orders/:id**: Retrieve a single order by ID
- **PUT /orders/:id**: Update an order by ID
- **DELETE /orders/:id**: Delete an order by ID

## Category Routes
- **POST /categories**: Create a new category
- **GET /categories**: Retrieve all categories
- **GET /categories/:id**: Retrieve a single category by ID
- **PUT /categories/:id**: Update a category by ID
- **DELETE /categories/:id**: Delete a category by ID

## Review Routes
- **POST /reviews**: Create a new review
- **GET /reviews**: Retrieve all reviews
- **GET /reviews/:id**: Retrieve a single review by ID
- **PUT /reviews/:id**: Update a review by ID
- **DELETE /reviews/:id**: Delete a review by ID