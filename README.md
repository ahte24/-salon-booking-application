# Salon management 

## Application Overview

This application is a robust Express.js backend service tailored for managing user authentication, staff availability, and user bookings. Designed with security and scalability in mind, it incorporates MongoDB for persistent storage, bcrypt for secure password hashing, JWT for secure and efficient user authentication, and several other technologies and practices to ensure a smooth operation.

## Key Features

- **User Authentication:** Secure signup and signin processes with hashed passwords.
- **Role-Based Access Control (RBAC):** Distinct access levels for staff and regular users to ensure appropriate access to functionalities.
- **Availability Scheduling:** Enables staff to set their availability for booking slots.
- **Slot Booking:** Allows users to book slots based on availability.

## Technologies and Frameworks

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Environment Variables:** dotenv
- **Cross-Origin Resource Sharing (CORS):** cors
- **Body Parsing:** body-parser

## Development Setup

### Prerequisites

- **Node.js:** Ensure Node.js is installed on your development machine.
- **MongoDB:** Have a MongoDB instance ready. This could be a local installation or a MongoDB Atlas cloud database.
- **Environment Variables:** Prepare an `.env` file for storing sensitive configurations such as database connection strings and the JWT secret.

### Installation Steps

1. **Clone the repository** to your local development environment.
2. **Install dependencies** by running `npm install` in the root directory of the project. This command installs all necessary npm packages as defined in `package.json`.
3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following entries to the `.env` file:
     ```
     MONGO_URI=<your_mongodb_connection_string>
     JWT_KEY=<your_secret_jwt_key>
     ```
   Ensure to replace `<your_mongodb_connection_string>` with your actual MongoDB URI and `<your_secret_jwt_key>` with a secret string for JWT signing.

### Running the Server

Execute the following command in the terminal at the root of your project:

```bash
npm start
```

This command launches the Express.js server, typically available at `http://localhost:3000`, unless otherwise configured.

## API Endpoints Overview

Below is a detailed overview of the application's API endpoints, including required parameters and expected responses.

### User Authentication

- **`POST /signup`**
  - **Description:** Registers a new user.
  - **Body Parameters:** `name`, `email`, `password`, `isStaff` (boolean).
  - **Success Response:** A message indicating successful registration.
  - **Error Response:** Relevant error message.

- **`POST /signin`**
  - **Description:** Authenticates a user and returns a JWT.
  - **Body Parameters:** `email`, `password`.
  - **Success Response:** JWT token.
  - **Error Response:** Relevant error message.

### Availability Management (Staff Only)

- **`POST /api/availability`**
  - **Description:** Sets availability for a staff member.
  - **Body Parameters:** `day`, `slots` (array of slot objects).
  - **Required:** JWT token with `isStaff` claim set to true.
  - **Success Response:** Confirmation message and details of the availability.
  - **Error Response:** Relevant error message.

- **`GET /api/available-slots/:day`**
  - **Description:** Fetches available slots for a given day.
  - **URL Parameters:** `day`.
  - **Required:** JWT token.
  - **Success Response:** Available slots for the specified day.
  - **Error Response:** Relevant error message.

### Booking Management

- **`POST /api/bookings`**
  - **Description:** Books an available slot.
  - **Body Parameters:** `day`, `numberOfBooking`, `slots` (array of selected slots).
  - **Required:** JWT token.
  - **Success Response:** Booking confirmation.
  - **Error Response:** Relevant error message.

- **`GET /api/bookings`**
  - **Description:** Retrieves all bookings (staff only).
  - **Required:** JWT token with `isStaff` claim set to true.
  - **Success Response:** List of all bookings.
  - **Error Response:** Relevant error message.

## Security and Authentication

- **JWT Authentication:** Secure routes utilize JWT for authentication. The token should be included in the `Authorization` header as `Bearer <token>`.
- **Password Hashing:** Passwords are hashed using bcrypt before storage, ensuring that plaintext passwords are never stored or transmitted.

## Environment Configuration

The application relies on environment variables for configuration to enhance security and flexibility. The `.env` file is critical for defining sensitive information such as the database connection string and JWT secret.

To document the API endpoints, request/response formats, and data models using Postman, follow these steps:

### 1. API Endpoints:

#### User Endpoints:
- **POST /signup**
  - Request Body:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "isStaff": "boolean"
    }
    ```
  - Response:
    - Success: Status 200 OK
    - Error: Status 500 Internal Server Error

- **GET /user**
  - Request Headers:
    - Authorization: Bearer [JWT Token]
  - Response:
    - Success: Status 200 OK
      ```json
      {
        "user": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "isStaff": "boolean"
        }
      }
      ```
    - Error: Status 404 User Not Found, Status 500 Internal Server Error

- **PUT /user**
  - Request Headers:
    - Authorization: Bearer [JWT Token]
  - Request Body:
    ```json
    {
      "name": "string",
      "email": "string",
      "isStaff": "boolean"
    }
    ```
  - Response:
    - Success: Status 200 OK
      ```json
      {
        "message": "User updated successfully",
        "user": {
          "_id": "string",
          "name": "string",
          "email": "string",
          "isStaff": "boolean"
        }
      }
      ```
    - Error: Status 404 User Not Found, Status 500 Internal Server Error

- **DELETE /user**
  - Request Headers:
    - Authorization: Bearer [JWT Token]
  - Response:
    - Success: Status 200 OK
      ```json
      {
        "message": "User deleted successfully"
      }
      ```
    - Error: Status 404 User Not Found, Status 500 Internal Server Error

#### Authentication Endpoints:
- **POST /signin**
  - Request Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response:
    - Success: Status 200 OK
      ```json
      {
        "token": "string"
      }
      ```
    - Error: Status 401 Unauthorized, Status 404 User Not Found, Status 500 Internal Server Error

- **GET /protected**
  - Request Headers:
    - Authorization: Bearer [JWT Token]
  - Response:
    - Success: Status 200 OK
      ```json
      {
        "message": "this is protected route"
      }
      ```
    - Error: Status 401 Unauthorized

#### Availability Endpoints:
- **POST /api/availability**
  - Request Headers:
    - Authorization: Bearer [JWT Token]
  - Request Body:
    ```json
    {
      "day": "string",
      "slots": [
        {
          "start": "string",
          "end": "string",
          "maxCapacity": "number"
        }
      ]
    }
    ```
  - Response:
    - Success: Status 201 Created
      ```json
      {
        "message": "Availability set successfully",
        "data": {
          "_id": "string",
          "day": "string",
          "slots": [
            {
              "start": "string",
              "end": "string",
              "maxCapacity": "number"
            }
          ]
        }
      }
      ```
    - Error: Status 400 Bad Request, Status 500 Internal Server Error

#### Booking Endpoints:
- **POST /api/bookings**
  - Request Headers:
    - Authorization: Bearer [JWT Token]
  - Request Body:
    ```json
    {
      "day": "string",
      "numberOfBooking": "number",
      "slots": [
        {
          "start": "string",
          "end": "string"
        }
      ]
    }
    ```
  - Response:
    - Success: Status 201 Created
      ```json
      {
        "message": "Slot Booked successfully"
      }
      ```
    - Error: Status 400 Bad Request, Status 500 Internal Server Error

### 2. Data Models:

#### User Model:
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "isStaff": "boolean"
}
```

#### Availability Model:
```json
{
  "_id": "string",
  "day": "string",
  "slots": [
    {
      "start": "string",
      "end": "string",
      "maxCapacity": "number"
    }
  ]
}
```

#### Booking Model:
```json
{
  "_id": "string",
  "userId": "string",
  "day": "string",
  "numberOfBooking": "number",
  "slots": [
    {
      "start": "string",
      "end": "string"
    }
  ]
}
```

### 3. Running the Application Locally:

1. Make sure you have Node.js and MongoDB installed on your system.
2. Clone the repository containing the provided code.
3. Navigate to the project directory in your terminal.
4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   MONGO_URI=<your MongoDB connection string>
   JWT_KEY=<your secret key for JWT>
   ```
5. Install dependencies by running:
   ```
   npm install
   ```
6. Start the server by running:
   ```
   npm start
   ```
7. The server should now be running locally on port 3000.

That's it! You can now use Postman to make requests to the API endpoints as documented above. Make sure to include the required headers and request bodies as specified.

## Conclusion

This documentation provides a thorough overview of setting up and utilizing the application's functionalities. For contributions or further customization, ensure adherence to best practices in Node.js and Express.js development, as well as secure handling of environment variables and authentication tokens.
