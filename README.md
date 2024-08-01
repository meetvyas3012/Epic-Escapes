# Tours Backend

An awesome tour booking site built on top of NodeJS, providing comprehensive functionality for user authentication, payment processing, tour management, and more. The backend follows the Model-View-Controller (MVC) architecture and utilizes MongoDB as its database.All the roues are protected throgh jwt tokens using Bearer authorization.Also implemented cookies for a user session.

## Table of Contents
- [Demo](#demo)
- [Key Features](#key-features-)
- [Technologies Used](#technologies-used)
- [Installation](#installation-)
- [Usage](#usage-)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment-)
- [Build With](#build-with-)
- [To-do](#to-do-)
- [Contributing](#contributing-)
- [License](#license)
- [Acknowledgement](#acknowledgement)

## Key Features 📝

### Authentication and Authorization
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Sign up, Log in, Logout, Update, and Reset Password**.
- **User profile**: Update username, photo, email, password, and other information.
- **User Roles**: A user can be a regular user, admin, lead guide, or guide. By default, a new user is a regular user.

### Tour Management
- Manage bookings, check tour maps, and user reviews and ratings.
- **Create, Update, and Delete Tours**: Only admin users or lead guides can perform these actions.
- **View Tours**: All users can view tours.

### Booking Management
- **Book Tours**: Only regular users can book tours and cannot book the same tour twice.
- **View Bookings**: Regular users can view their booked tours. Admins and lead guides can view all bookings.
- **Manage Bookings**: Admins and lead guides can create, edit, and delete any bookings.

### Reviews
- **Post Reviews**: Regular users can write, edit, and delete reviews for tours they have booked, but cannot review the same tour twice.
- **View Reviews**: All users can see reviews of each tour.
- **Admin Review Management**: Admins can delete any review.

### Favorite Tours
- **Manage Favorites**: Regular users can add and remove booked tours to/from their list of favorite tours.

### Payment Processing
- **Stripe Integration**: Handle payments seamlessly through Stripe.

### Geolocation
- **Nearest Tours**: Find the nearest tours based on user location.

### Data Management
- **Pagination**: Efficiently handle large datasets with pagination.

### Email Services
- **Nodemailer**: Send emails for various purposes, including account verification, password reset, and notifications.

### Forgot and Reset Password
- **Password Management**: Users can reset their passwords via email.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT (JSON Web Token)**: Secure authentication
- **Stripe**: Payment processing
- **Nodemailer**: Email services
- **Pug**: Template engine
- **ParcelJS**: Web application bundler
- **Postman**: API testing
- **Mailtrap & Mailersend**: Email delivery platform

## Installation 🛠️

1. Clone the repository:
   ```bash
   git clone https://github.com/meetvyas3012/Tours-Backend.git
   cd tours-backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```plaintext
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage 🤔

### Authentication

- **Register**: `POST /api/v1/users/signup`
- **Login**: `POST /api/v1/users/login`
- **Forgot Password**: `POST /api/v1/users/forgot-password`
- **Reset Password**: `PATCH /api/v1/users/reset-password/:token`

### Tours

- **Get All Tours**: `GET /api/v1/tours`
- **Get Tour by ID**: `GET /api/v1/tours/:id`
- **Create Tour**: `POST /api/v1/tours` (admin only)
- **Update Tour**: `PATCH /api/v1/tours/:id` (admin only)
- **Delete Tour**: `DELETE /api/v1/tours/:id` (admin only)
- **Get Tours Near Location**: `GET /api/v1/tours/near/:lat_lng`

### Reviews

- **Get All Reviews**: `GET /api/v1/reviews`
- **Get Reviews for a Tour**: `GET /api/v1/tours/:tour_id/reviews`
- **Add Review**: `POST /api/v1/tours/:tourId/reviews`
- **Update Review**: `PATCH /api/v1/reviews/:id`
- **Delete Review**: `DELETE /api/v1/reviews/:id`

### Payments

- **Create Payment Intent**: `POST /api/v1/tours/checkout-session/:id`

## API Endpoints

### Tours
- **List Tours**: `GET /api/v1/tours`
- **Tour Stats**: `GET /api/v1/tours/tour-stats`
- **Top 5 Cheap Tours**: `GET /api/v1/tours/top-5-cheap`
- **Tours Within Radius**: `GET /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit`

## Deployment 🌍

### Steps:
1. Initialize Git repository:
   ```sh
   git init
   git add -A
   git commit -m "Commit message"
   ```

## Build With 🏗️
- **NodeJS**: JavaScript runtime environment
- **Express**: Web framework
- **Mongoose**: ODM library
- **MongoDB Atlas**: Cloud database service
- **Pug**: Template engine
- **JWT**: Security token
- **ParcelJS**: Web application bundler
- **Stripe**: Online payment API
- **Postman**: API testing
- **Mailtrap & Sendgrid**: Email delivery platform

## To-do 🗒️
- Review and rating improvements
- Prevent duplicate bookings
- Advanced authentication features (email confirmation, refresh token, two-factor authentication)

## Contributing 💡

Pull requests are welcome! Please open an issue or submit a pull request for any bugs, improvements, or new features.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgement

Thank you for using the Tour Backend project!