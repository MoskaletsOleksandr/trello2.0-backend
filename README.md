# Trello2.0-Backend

---

## _Description_

**Trello2.0-Backend** is the backend component of an educational project created to support the Trello2.0 application. This project has no commercial purposes and is intended solely for education.

### Main features:

- **Google Authentication**: Users can log in using Google Authentication.

- **Token Management**: The application handles access and refresh tokens for authentication and refresh purposes.

- **Profile Update**: Users can update their name, email, and avatar.

- **Feedback Sending**: Users can send feedback to the developers.

- **Refresh Endpoint**: Allows refreshing access tokens using refresh tokens.

- **Middleware**: The application uses various middlewares for validation, authentication, and file uploads.

- **Decorator Usage**: The use of the ctrlWrapper decorator to structure functions and add additional functionality.

- **Email Service**: Sends confirmation and feedback emails to users and developers.

- **Avatar Upload**: Handles uploading and processing user avatars.

- **Error Handling**: The application handles errors and returns appropriate HTTP status codes.

- **Related Data Deletion**: When deleting a board, associated columns and cards linked to it are also removed.

- **Input Data Validation**: The code contains input data validation, such as checking for missing required fields
  and data correctness.

### Frontend:

You can find the backend code
[here: https://github.com/MoskaletsOleksandr/trello2.0](https://github.com/MoskaletsOleksandr/trello2.0).

The frontend complements the backend by offering an intuitive and user-friendly interface for managing tasks, boards,
and cards. Both the frontend and backend work in tandem to create a complete Trello 2.0 experience.

---

### Instructions for Installing and Running Trello 2.0 Locally

To install and run Trello 2.0 locally, follow these steps:

1. **Clone the Repository:**

   - Open your terminal and navigate to the folder where you want to save the project.
   - Use Git to clone the Trello 2.0 Backend repository with the following command:

     ```bash
     git clone https://github.com/MoskaletsOleksandr/trello2.0-backend.git
     ```

2. **Navigate to the Project Folder:**

   - Go to the project folder you've just created:

     ```bash
     cd trello2.0-backend
     ```

3. **Install Dependencies:**

   - Execute the following command to install the required dependencies:

     ```bash
     npm install
     ```

4. **Create an Environment Variables File:**

   - Create an environment file `.env` in the root folder of the project and fill it with your environment values. For example:

     ```env
     DB_HOST=localhost
     PORT=5000
     ACCESS_SECRET_KEY=your_access_secret_key
     REFRESH_SECRET_KEY=your_refresh_secret_key
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     SENDER_EMAIL=your_sender_email
     SENDER_PASSWORD=your_sender_password
     CLIENT_ID=your_client_id
     CLIENT_SECRET=your_client_secret
     CLIENT_URL=http://localhost:3000
     CALLBACK_URL=http://localhost:3000/auth/google/callback
     ```

   Replace the variable values with your own.

5. **Start the Server:**

   - Start the server with the following command:

     ```bash
     npm start
     ```

   The server will run on the port you specified in the `.env` file.

6. **Clone the Frontend (Optional):**

   - To clone the Trello 2.0 Frontend repository, open a new terminal and navigate to the folder where you want to save the frontend.
   - Use Git to clone the Trello 2.0 Frontend repository with the following command:

     ```bash
     git clone https://github.com/MoskaletsOleksandr/trello2.0.git
     ```

   - Next, go to the frontend folder and follow the relevant steps to set up and run the frontend application.

Now you can use Trello 2.0 locally and develop it on your own computer. I wish you success with the application!

---

## Backend Technologies Used

Trello 2.0 Backend leverages a variety of technologies, libraries, and tools to deliver its features and functionality. Below is a list of the key technologies and libraries employed in the project:

- **[Node.js](https://nodejs.org/):** A runtime environment for executing JavaScript on the server.
- **[Express.js](https://expressjs.com/):** A web application framework for building server-side applications and APIs.
- **[MongoDB](https://www.mongodb.com/):** A NoSQL database for storing and managing data.
- **[Mongoose](https://mongoosejs.com/):** An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **[JWT (JSON Web Tokens)](https://jwt.io/):** A method for securely transmitting information between parties as a JSON object.
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs):** A library for hashing and comparing passwords.
- **[Cloudinary](https://cloudinary.com/):** A cloud-based image and video management service.
- **[cookie-parser](https://www.npmjs.com/package/cookie-parser):** A middleware for parsing cookies.
- **[CORS (Cross-Origin Resource Sharing)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS):** A mechanism that allows many web applications to make requests to a different domain.
- **[dotenv](https://www.npmjs.com/package/dotenv):** A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **[joi](https://joi.dev/):** A schema description language and data validator for JavaScript objects.
- **[morgan](https://www.npmjs.com/package/morgan):** A request logger middleware.
- **[multer](https://www.npmjs.com/package/multer):** A middleware for handling file uploads.
- **[multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary):** A storage engine for Multer that uploads files to Cloudinary.
- **[nanoid](https://www.npmjs.com/package/nanoid):** A tiny, secure, URL-friendly unique string ID generator.
- **[nodemailer](https://nodemailer.com/):** A module for sending emails.
- **[passport](http://www.passportjs.org/):** A middleware for authenticating requests.
- **[passport-google-oauth20](http://www.passportjs.org/packages/passport-google-oauth20/):** A Passport.js strategy for authenticating with Google using OAuth 2.0.

---

## Project Structure

- **_controllers_** - This directory contains the controller files responsible for handling various aspects
  of the application.
  - **_boardController.js_** - Manages board-related operations.
  - **_cardController.js_** - Handles card-related functionality.
  - **_columnController.js_** - Controls column-related operations.
  - **_userController.js_** - Manages user-related actions.
- **_data_** - Contains data related to the application.
  - **_backgrounds_** - Stores links to background images.
- **_decorators_** - Houses decorator files used to structure functions and add additional functionality.
  - **_ctrlWrapper.js_** - A decorator to wrap controller functions.
  - **_validateBody.js_** - A decorator for validating request data.
- **_helpers_** - This directory comprises utility/helper functions used throughout the application.
  - **_cardService.js_** - Provides services related to cards.
  - **_columnService.js_** - Offers services for columns.
  - **_createEmails.js_** - Handles email creation.
  - **_HttpError.js_** - Defines HTTP error classes.
  - **_sendEmail.js_** - Handles email sending.
  - **_tokenService.js_** - Manages tokens.
  - **_uploadAvatar.js_** - Handles avatar uploads.
  - **_userService.js_** - Contains user-related services.
- **_middlewares_** - Contains middleware files for request handling.
  - **_authenticate.js_** - Middleware for user authentication.
  - **_checkFileType.js_** - Middleware to check file types.
  - **_extractDeviceId.js_** - Middleware to extract device IDs.
  - **_googleAuthenticate.js_** - Middleware for Google authentication.
  - **_isEmptyBody.js_** - Middleware for checking empty request bodies.
  - **_isValidBoardId.js_** - Middleware to validate board IDs.
  - **_isValidCardId.js_** - Middleware to validate card IDs.
  - **_isValidColumnId.js_** - Middleware to validate column IDs.
  - **_uploadCloud.js_** - Middleware for cloud-based uploads.
- **_models_** - Houses the model files representing data structures.
  - **_board.js_** - Model for boards.
  - **_card.js_** - Model for cards.
  - **_column.js_** - Model for columns.
  - **_token.js_** - Model for tokens.
  - **_user.js_** - Model for users.
- **_routes_** - Contains route files for various application routes.
  - **_boardRouter.js_** - Handles board-related routes.
  - **_cardRouter.js_** - Manages card-related routes.
  - **_columnRouter.js_** - Manages column-related routes.
  - **_userRouter.js_** - Handles user-related routes.
- **_schemas_** - Contains schema files used for data validation.
  - **_boardSchemas.js_** - Schemas for board data validation.
  - **_cardSchemas.js_** - Schemas for card data validation.
  - **_columnSchemas.js_** - Schemas for column data validation.
  - **_userSchemas.js_** - Schemas for user data validation.
- **_.env_** - Configuration file for environment variables.
- **_.gitignore_** - Specifies ignored files and directories for Git.
- **_app.js_** - The main application file.
- **_env.example_** - An example of the environment variable configuration file.
- **_package-lock.json_** - A lock file specifying exact versions of dependencies.
- **_package.json_** - Describes the project and its dependencies.
- **_README.md_** - The project's documentation.
- **_server.js_** - The server configuration and initialization.

---

## How It Works

1. **User Authentication Middleware**: The `authenticate` middleware is responsible for authenticating users. It checks for a valid access token in the request headers, verifies it, and attaches the user data to the request if the token is valid. If the token is invalid or missing, it returns a 401 error.

2. **File Type Validation Middleware**: The `checkFileType` middleware checks the file type of uploaded files, ensuring that only images are allowed. If an invalid file type is detected, it returns a 400 error.

3. **Google OAuth Authentication Strategy**: The code defines a Google OAuth strategy for user authentication. Users can log in with their Google accounts. If an existing user is found, it logs them in, and if it's a new user, it creates a new account.

4. **Deletion of Cards and Columns when Deleting a Board**: When a board is deleted, the system goes through the following steps to delete all associated cards and columns:

   - Retrieve the list of all columns on the board to be deleted.
   - For each column in the list, delete all cards associated with it.
   - After deleting the cards, remove the column itself.

5. **Moving a Card from this Controller**:
   The `moveCardById` controller handles the process of moving a card to a new location, which includes the following steps:
   - Obtain the necessary data from the request, such as `cardId`, `newColumnId`, and `newOrderInColumn`.
   - Verify the presence of all required data in the request and ensure data correctness.
   - Find the card that needs to be moved (`cardToUpdate`).
   - Perform card movement operations based on conditions:
     - If `newColumnId` and `oldColumnId` are the same, and `newOrderInColumn` is 'last', the card remains in the same column but is moved to the last position.
     - If `newColumnId` and `oldColumnId` are the same, and `newOrderInColumn` is not 'last', the card stays in the same column and is moved to the specified position, shifting other cards in the column as needed.
     - If `newColumnId` and `oldColumnId` are different, and `newOrderInColumn` is 'last', the card is moved to a different column to the last position.
     - If `newColumnId` and `oldColumnId` are different, and `newOrderInColumn` is not 'last', the card is moved to a different column to the specified position.
   - After the card is successfully moved, all necessary changes are saved in the database.
   - The controller responds with updated data of the columns, which can be used for updating the user interface.

---

## My Future Plans

Here are the features and improvements I plan to implement in Trello2.0:

1. **Secure Password Reset**: I'm working on adding a secure password reset functionality through a frontend form, ensuring users can reset their passwords with ease.

2. **Moving Cards and Columns Between Boards**: My goal is to allow users to seamlessly move cards and columns between boards, providing a more flexible and extended project management experience.

3. **Device Information**: I plan to explore retrieving device data on the frontend, enabling me to work on creating a more seamless user experience and enhancing token management across multiple devices.

Stay tuned for these upcoming features, and thank you for your continued support and feedback. If you have any suggestions or feature requests, please feel free to reach out through the app or via email.

---

## License

**Free Software, Hell Yeah!**
