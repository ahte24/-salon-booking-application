## 1. API Endpoints:

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
