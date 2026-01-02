# E-Commerce Bicycle Shop

A full-featured e-commerce platform for selling bicycles and accessories. This application provides a complete online shopping experience, from browsing products to completing orders, along with an admin panel for site management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [File Structure](#file-structure)
- [License](#license)

## Features

### User Features
- **Authentication**: Secure user registration and login with email/password and Google OAuth.
- **Product Catalog**: Browse, search, and filter products by category.
- **Product Details**: View detailed information for each product.
- **Shopping Cart**: Add/remove products and update quantities.
- **Wishlist**: Save products for later.
- **Checkout**: Seamless checkout process with support for multiple shipping addresses.
- **Order Management**: View order history, order details, and invoices.
- **Profile Management**: Update user profile, manage addresses, and change password.
- **Wallet**: A personal wallet for each user.

### Admin Features
- **Dashboard**: An overview of sales and site statistics.
- **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products.
- **Category Management**: Manage product categories.
- **Order Management**: View and update order statuses.
- **User Management**: View and manage customer accounts.
- **Coupon & Offer Management**: Create and manage discount coupons and special offers.
- **Sales Reports**: Generate and view sales reports.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **View Engine**: EJS (Embedded JavaScript templates)
- **Authentication**: Passport.js (Google OAuth), bcrypt, Express Sessions
- **Payment Gateway**: Razorpay
- **File Uploads**: Multer
- **Email**: Nodemailer
- **Frontend**: HTML, CSS, JavaScript, Bootstrap, jQuery

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/ECOM-Bicycle.git
    cd ECOM-Bicycle
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory of the project and add the following variables.

```env
# MongoDB Connection
# Replace with your MongoDB connection string
MONGO_URL=mongodb://localhost:27017/ECOM-Bicycle

# Express Session Secret
# Replace with a long, random string
sessionSecret=mySecretSessionKey

# Google OAuth Credentials
# Note: The variable names have a typo ('cliendId', 'cliendSecret') in the source code.
# Please use these names as-is until the code is corrected.
googleCliendId=YOUR_GOOGLE_CLIENT_ID
googleCliendSecret=YOUR_GOOGLE_CLIENT_SECRET
googleCallbackURL=http://localhost:3000/google/callback

# Nodemailer Credentials (for sending emails)
# It is strongly recommended to use environment variables instead of hardcoding these.
NODEMAILER_USER=your-email@gmail.com
NODEMAILER_PASS=your-gmail-app-password
```

**Note on Nodemailer:** The current implementation has email credentials hardcoded in `controller/userController.js`. It is highly recommended to modify the code to use the environment variables above for better security.

## Usage

To start the application in development mode with auto-reloading, run:

```sh
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000) (or the port you configure).

## File Structure

The project follows a standard MVC (Model-View-Controller) architecture.

```
ECOM-Bicycle/
├── config/             # Database connection configuration
├── controller/         # Logic for handling requests (controllers)
├── helpers/            # Helper scripts (e.g., Passport.js setup)
├── middleware/         # Custom Express middleware
├── models/             # Mongoose schemas and models
├── node_modules/       # Project dependencies
├── public/             # Static assets (CSS, JS, images)
├── routes/             # Express route definitions
├── views/              # EJS templates for rendering pages
├── .env                # Environment variables (create this file)
├── .gitignore          # Git ignore file
├── index.js            # Main application entry point
├── package.json        # Project metadata and dependencies
└── README.md           # This file
```

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.
