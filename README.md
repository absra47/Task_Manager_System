# Task_Manager_System

A robust and scalable RESTful API for managing tasks, built with Node.js, Express, and MongoDB. This API supports user authentication, task creation, retrieval with pagination and search, updating, and secure deletion.

## Live API

🚀 Check out the deployed API here: `https://task-manager-system-utp6.onrender.com/api` remember your `/api` base path for actual endpoints)\_

## GitHub Repository

🔗 This project's source code is available on GitHub: `https://github.com/absra47/Task_Manager_System.git`

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt for password hashing
- **Deployment:** Render
- **Testing** Postman, Thunder Client (VS Code Extension)
- **Environment Management:** Dotenv
- **HTTP Requests:** CORS

## How to Run the Project Locally

To set up and run this project on your local machine, follow these steps:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/absra47/Task_Manager_System.git
    cd Task_Manager_System
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following:

    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string_here
    TEST_MONGO_URI=your_test_mongodb_connection_string_here # For running tests
    JWT_SECRET=a_very_secret_key_for_jwt_tokens
    ```

    - **`MONGO_URI`**: Get this from your MongoDB Atlas dashboard or your local MongoDB setup.
    - **`TEST_MONGO_URI`**: Use a different database name for testing to prevent data corruption (e.g., `mongodb://localhost:27017/taskmanager-test`).
    - **`JWT_SECRET`**: A strong, random string for signing JWTs.

4.  **Run the Server:**

        - **Development Mode (with Nodemon):**
          ```bash
          npm run dev
          ```
        - **Production Mode:**
          `bash

    npm start
    `      The API will be running on`http://localhost:5000/api`.

5.  **Run Tests:**
    ```bash
    npm test
    ```

## API Endpoints

A detailed overview of all API endpoints, their methods, request/response structures, and error codes can be found in the dedicated [API Documentation](API.md) file.

**Brief Overview:**

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Authenticate a user and get a JWT.
- `GET /api/users/profile`: Get the profile of the authenticated user.
- `POST /api/tasks`: Create a new task.
- `GET /api/tasks`: Get all tasks for the authenticated user (supports pagination and search).
- `PATCH /api/tasks/:id`: Update a task's status.
- `DELETE /api/tasks/:id`: Delete a task (requires confirmation in body).

## Challenges Faced & How I Overcame Them

- **[Challenge 1 - e.g., Setting up robust error handling]:**
  - _How I overcame it:_ Implemented a centralized error handling middleware to catch errors and return consistent JSON responses, rather than letting the server crash. This involved using `try-catch` blocks in controllers and passing errors to `next(err)`.
- **[Challenge 2 - e.g., Implementing pagination and search]:**
  - _How I overcame it:_ Used Mongoose's powerful query methods (`skip`, `limit`, `find` with regex for search) combined with `countDocuments` to calculate total pages and provide comprehensive pagination metadata.
- **[Challenge 3 - e.g., Secure deletion requiring confirmation]:**
  - _How I overcame it:_ Added an extra layer of security by requiring a specific string in the request body, validating it in the controller before proceeding with the `findOneAndDelete` operation. This prevents accidental data loss.
- **[Challenge 4 - e.g., Deployment to Render]:**
  - _How I overcame it:_ Configured a `Procfile`, ensured the `start` script was correct, and meticulously added environment variables in the Render dashboard, carefully checking the MongoDB Atlas connection string and IP access settings.

---
