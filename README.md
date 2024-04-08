# API Documentation

Welcome to the API documentation for our application. This guide provides detailed information about the endpoints, request/response formats, data models, and instructions for running the application locally.

## Table of Contents

1. [Introduction](#introduction)
2. [Endpoints](#endpoints)
    - [User Endpoints](#user-endpoints)
    - [Authentication Endpoints](#authentication-endpoints)
    - [Availability Endpoints](#availability-endpoints)
    - [Booking Endpoints](#booking-endpoints)
3. [Data Models](#data-models)
4. [Running the Application Locally](#running-the-application-locally)

## Introduction<a name="introduction"></a>

Our application provides services for user management, authentication, staff availability management, and slot booking functionalities. This API documentation aims to guide developers on how to interact with the application's endpoints effectively.

## Endpoints<a name="endpoints"></a>

### User Endpoints<a name="user-endpoints"></a>

- **POST /signup**
  - Registers a new user.
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
  - Retrieves user information.
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
  - Updates user information.
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
  - Deletes a user.
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

### Authentication Endpoints<a name="authentication-endpoints"></a>

- **POST /signin**
  - Authenticates a user and generates a JWT token.
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
  - Accesses a protected route.
  - Request Headers:
    - Authorization: Bearer [JWT Token]
  - Response:
    - Success: Status 200 OK
      ```json
      {
        "message": "this is a protected route"
      }
      ```
    - Error: Status 401 Unauthorized

### Availability Endpoints<a name="availability-endpoints"></a>

- **POST /api/availability**
  - Sets availability for staff members.
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

### Booking Endpoints<a name="booking-endpoints"></a>

- **POST /api/bookings**
  - Books available slots.
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

## Data Models<a name="data-models"></a>

### User Model:
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "isStaff": "boolean"
}
```

### Availability Model:
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

### Booking Model:
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

## Running the Application Locally<a name="running-the-application-locally"></a>

To run the application locally, follow these steps:

1. Ensure you have **Node.js** and **MongoDB** installed on your system.
2. Clone the repository containing the code.
3. Navigate to the project directory in your terminal.
4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   MONGO_URI=<your MongoDB connection string>
   JWT_KEY=<your secret key for JWT>
   ```
5. Install dependencies by running `npm install`.
6. Start the server by running `npm start`.
7. The server should now be running locally on port 3000.

You can now use Postman or any other HTTP client to make requests to the API endpoints as documented above. Make sure to include the required headers and request bodies as specified.

That concludes our API documentation. If you have any questions or issues, feel free to reach out

 to our support team. Happy coding!
