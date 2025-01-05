# Backend Application for Managing Contacts and Users

## Overview

This project is a fully-featured backend application designed to manage contacts and users. It includes functionality for user session management, password reset, and email notification. The application also supports adding user photos, which are stored in Cloudinary, with the image URLs saved in MongoDB.

**API Endpoints**
Here are some of the key API endpoints:

- User Authentication

  - POST /auth/register: Register a new user.
  - POST /auth/login: Login and receive a JWT token.
  - POST /auth/refresh: Refresh session accessToken
  - POST /auth/logout: Logout clear cookies and remove session from database
  - POST /auth/send-reset-email: Request a password reset link.
  - POST /auth/reset-pwd: Reset user password

- Contacts

  - GET /contacts: Get all contacts.
  - GET /contacts/{contactId}: Get contact by id
  - POST /contacts: Create a new contact with an optional photo.
  - PATCH /contacts/{contactId}: Update contacts parameters
  - DELETE /contacts/{contactId}: Delete an existing Contact

For a full list of endpoints and their details, refer to the [Swagger documentation](https://nodejs-hw-mongodb-n71x.onrender.com/api-docs/).
