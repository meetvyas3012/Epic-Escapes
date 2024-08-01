# Tours Backend

This is a backend project for a tours website, developed using Node.js and Express. The backend provides comprehensive functionality for user authentication, payment processing, tour management, and more. The application follows the Model-View-Controller (MVC) architecture and utilizes MongoDB as its database.

## Features

- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Email Services**: Send emails for various purposes, including account verification, password reset, and notifications.
- **Payment Processing**: Integrates with Stripe to handle payments.
- **Reviews and Ratings**: Users can post reviews and rate tours.
- **Geolocation**: Find the nearest tours based on user location.
- **Pagination**: Efficiently handle large datasets with pagination.
- **Forgot and Reset Password**: Users can reset their passwords via email.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used

- Node.js
- Express
- MongoDB
- JWT (JSON Web Token)
- Stripe
- Nodemailer (for email services)
- Mongoose (MongoDB ODM)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tours-backend.git
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

## Usage

### Authentication

- **Register**: `POST /api/v1/users/signup`
- **Login**: `POST /api/v1/users/login`
- **Forgot Password**: `POST /api/v1/users/forgotPassword`
- **Reset Password**: `PATCH /api/v1/users/resetPassword/:token`

### Tours

- **Get All Tours**: `GET /api/v1/tours`
- **Get Tour by ID**: `GET /api/v1/tours/:id`
- **Create Tour**: `POST /api/v1/tours` (admin only)
- **Update Tour**: `PATCH /api/v1/tours/:id` (admin only)
- **Delete Tour**: `DELETE /api/v1/tours/:id` (admin only)
- **Get Tours Near Location**: `GET /api/v1/tours/near/:latlng`

### Reviews

- **Get All Reviews**: `GET /api/v1/reviews`
- **Get Reviews for a Tour**: `GET /api/v1/tours/:tourId/reviews`
- **Add Review**: `POST /api/v1/tours/:tourId/reviews`
- **Update Review**: `PATCH /api/v1/reviews/:id`
- **Delete Review**: `DELETE /api/v1/reviews/:id`

### Payments

- **Create Payment Intent**: `POST /api/v1/payments/create`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, improvements, or new features.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding! If you have any questions, feel free to open an issue.