# Quid Pro Quo — Server

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Runtime-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/Firebase%20Admin-Authentication-FFCA28?logo=firebase&logoColor=black" alt="Firebase Admin" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel" alt="Vercel" />
</p>

The backend API for **Quid Pro Quo**, a full-stack item lending and exchange platform. Built with Node.js, Express, and MongoDB, the server manages user records, item listings, borrowing requests, agreements, and trust-related features.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security](#security)

## Overview

Quid Pro Quo provides an API for managing the lifecycle of an item lending or exchange transaction.

Users can create listings, submit requests to borrow items, and—after the owner accepts a request—create an agreement that records the participants and proposed dates. The server is responsible for data validation, database operations, authentication, and authorization.

## Features

- **REST API:** Structured HTTP endpoints for managing application resources.
- **MongoDB integration:** Persistent storage through Mongoose.
- **Firebase authentication:** Verify Firebase ID tokens using Firebase Admin.
- **User management:** Work with MongoDB user records associated with Firebase identities.
- **Item management:** Create, retrieve, update, and delete item listings.
- **Item filtering:** Support for available filters such as category, status, owner, and search, where implemented.
- **Borrowing requests:** Create and retrieve requests, and accept or reject pending requests.
- **Agreement creation:** Create an agreement when a borrowing request is accepted.
- **Return tracking:** Record when an item has been returned and update its availability.
- **Rating system:** Support trust-related ratings associated with agreements, where implemented.
- **Ownership checks:** Restrict item modifications to the appropriate owner.
- **Environment-based configuration:** Keep database connections and server credentials outside committed source code.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server and routing |
| MongoDB | Database |
| Mongoose | Schemas, models, and database queries |
| Firebase Admin SDK | Server-side Firebase token verification |
| dotenv | Load local environment variables |
| Vercel | Backend deployment |

## Project Structure

The following structure is representative; preserve the actual names used in your repository.

```text
server/
├── config/
│   ├── db.js
│   └── firebaseAdmin.js
├── controllers/
│   ├── userController.js
│   ├── itemController.js
│   ├── requestController.js
│   ├── agreementController.js
│   └── ...
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Users.js
│   ├── Item.js
│   ├── Request.js
│   ├── Agreement.js
│   └── ...
├── routes/
│   ├── userRouters.js
│   ├── itemRouters.js
│   ├── requestRouters.js
│   └── ...
├── .env
├── .gitignore
├── firebasekey.json
├── index.js
├── package.json
└── package-lock.json
```

`firebasekey.json` is shown to explain the local configuration described in this project. It contains sensitive credentials and must not be committed to GitHub.

## Getting Started

### Prerequisites

- Node.js and npm
- Git
- A MongoDB database, either local or hosted on MongoDB Atlas
- A Firebase project with Firebase Authentication configured
- A Firebase Admin service-account credential

### 1. Clone the repository

```bash
git clone <YOUR_SERVER_REPOSITORY_URL>
cd <YOUR_SERVER_FOLDER>
```

### 2. Install dependencies

```bash
npm install
```

If `dotenv` is used by the server, it should be listed in `package.json` and recorded in `package-lock.json`.

### 3. Configure environment variables

Create a `.env` file in the server root, next to `index.js`.

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/quid-pro-quo
FIREBASE_SERVICE_ACCOUNT=<YOUR_SERVICE_ACCOUNT_JSON>
```

The MongoDB example above is for local development only. For production, set `MONGODB_URI` to your MongoDB Atlas connection string.

`FIREBASE_SERVICE_ACCOUNT` should contain the service-account JSON serialized as a single line if your `firebaseAdmin.js` expects a JSON string. Use your actual credential and the exact format expected by that module.

Do not copy real credentials into this README or commit them to the repository.

### 4. Load dotenv before configuration imports

At the top of `index.js`, before importing modules that read environment variables:

```javascript
require('dotenv').config();
```

Your database connection can then use the environment variable:

```javascript
const mongoose = require('mongoose');

//==========================MongoDB Connection============================

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected Successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
};

module.exports = connectDB;
```

If your local workflow requires a default local database URI, configure that fallback deliberately. For deployment, ensure the cloud database URI is present rather than silently falling back to localhost.

### 5. Configure Firebase Admin

The server must initialize Firebase Admin with the service-account credentials.

The implementation should read `FIREBASE_SERVICE_ACCOUNT` from `process.env` and parse it as JSON if that is the format configured above.

Your existing Firebase Admin module may use a different initialization approach. Keep its expected format consistent with the environment variable rather than adding a second initialization unnecessarily.

### 6. Start the server

Run the script defined in `package.json`. For a project with a `dev` script, this is typically:

```bash
npm run dev
```

A successful local startup should report that the server is running and MongoDB is connected.

### 7. Test the API

Use Postman or another HTTP client to test the endpoints.

For protected endpoints, sign in with a valid Firebase account and provide its Firebase ID token:

```http
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

The server should verify the token before allowing protected operations.

## Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Local server port, if read by the application | `3000` |
| `MONGODB_URI` | MongoDB connection string | Local URI or Atlas URI |
| `FIREBASE_SERVICE_ACCOUNT` | Serialized Firebase Admin service-account JSON, if expected by your configuration | Keep the actual value secret |

Environment variable names must match the names read by your code.

### Local MongoDB

```env
MONGODB_URI=mongodb://127.0.0.1:27017/quid-pro-quo
```

### MongoDB Atlas

Use the connection string generated by Atlas, with the database name and any required options configured correctly.

```env
MONGODB_URI=mongodb+srv://<DATABASE_USER>:<DATABASE_PASSWORD>@<YOUR_CLUSTER>/<DATABASE_NAME>
```

Replace every placeholder with your actual values. If the password contains special characters, encode them appropriately for the URI.

## Authentication

Firebase Authentication handles the user sign-in process on the client. The server uses Firebase Admin to verify the ID token sent by the client.

A typical protected request follows this process:

1. The client obtains an ID token from the signed-in Firebase user.
2. The client sends the token in the `Authorization` header.
3. `authMiddleware` extracts and verifies the token.
4. The verified identity becomes available to protected controllers through `req.user`.
5. Controllers look up the corresponding MongoDB user using the Firebase UID when necessary.
6. The controller validates permissions before changing data.

Authentication alone does not prove ownership. For example, a signed-in user must not be able to edit or delete another user's item simply by sending a request directly through Postman.

## API Endpoints

The following table describes the intended resource groups. Confirm the exact route prefixes and methods against the routes registered in `index.js` and the individual router files.

| Resource | Typical operations | Purpose |
|---|---|---|
| `/users` | Create, list, retrieve, update, delete | Manage application user records |
| `/items` | Create, list, retrieve, update, delete | Manage item listings |
| `/requests` | Create, list, retrieve, accept, reject, delete | Manage borrowing requests |
| `/agreements` | Create or retrieve, update return status, delete where supported | Track accepted borrowing arrangements |
| `/ratings` | Create or retrieve ratings, where implemented | Record trust-related feedback |

### Items

The item resource supports listing and managing items. Available query filters may include:

- `category`
- `status`
- `owner`
- `search`

Example:

```http
GET /items
```

An individual item can be retrieved by ID:

```http
GET /items/:id
```

Creating, updating, and deleting items should require authentication as appropriate, with ownership verification for modifications.

### Borrowing requests

A request can identify the item, proposed start and end dates, and agreement type, depending on the controller's validation rules.

```http
POST /requests
```

Example request body:

```json
{
  "item": "ITEM_OBJECT_ID",
  "proposedStart": "2026-10-20",
  "proposedEnd": "2026-10-25",
  "agreementType": "lending"
}
```

The server should derive the requester from the verified Firebase identity rather than trusting a requester ID supplied by the client.

Typical request actions include:

```http
GET /requests
GET /requests/:id
PATCH /requests/:id/accept
PATCH /requests/:id/reject
DELETE /requests/:id
```

If implemented, the authenticated user's own requests can be retrieved through:

```http
GET /requests/my
```

Register `/requests/my` before `/requests/:id` so Express does not interpret `my` as a request ID.

### Agreements

When an owner accepts a pending request, the server can create an agreement containing the item, owner, borrower, originating request, agreement type, and dates.

Example operations, depending on the configured router:

```http
GET /agreements
GET /agreements/:id
```

The return operation should mark the agreement as returned and update the item's availability, while preventing an item from being returned repeatedly.

Check the actual agreement router for the exact return endpoint.

## Database Models

The application uses Mongoose models to define and relate its data.

### User

Stores application user information and the Firebase UID used to associate a MongoDB user record with a Firebase identity.

### Item

Stores listing details such as its name, category, description, condition, location, owner, and availability status, according to the implemented schema.

### Request

Stores borrowing request details, including the item, requester, owner, proposed dates, agreement type, and status.

### Agreement

Records an accepted borrowing arrangement, including the item, owner, borrower, associated request, dates, and return status.

### Rating

Where implemented, associates trust-related feedback with an agreement and the user who submitted the rating.

Refer to the model files for the authoritative schema definitions and enum values.

## Deployment

### MongoDB Atlas

For a deployed server, use a hosted MongoDB database rather than `mongodb://127.0.0.1:27017`.

1. Create a MongoDB Atlas cluster.
2. Create a database user with an appropriately restricted password and permissions.
3. Configure Network Access for your deployment environment.
4. Copy the Atlas connection string and configure the database name.
5. Set `MONGODB_URI` in the deployment platform's environment variables.
6. Verify the database connection in the deployment logs.

Allowing access from `0.0.0.0/0` permits connections from any IP address at the network-access layer. If you use this setting, strong database credentials and least-privilege database permissions are essential. Prefer a narrower network rule when the deployment platform's networking allows it.

### Vercel

1. Import the server repository into Vercel.
2. Configure the correct project root and build settings for the server.
3. Add `MONGODB_URI` and `FIREBASE_SERVICE_ACCOUNT` to the server project's environment variables.
4. Add any other variables required by the application.
5. Deploy the server.
6. Test an API endpoint and inspect the runtime logs.

Redeploy after changing environment variables so the deployment uses the updated configuration.

### Connecting the client

Set the client project's `VITE_API_URL` to the deployed server's base URL. Configure CORS on the server to allow the actual client domain.

The client and server environment variables are configured separately.

## Troubleshooting

### MongoDB connection fails

- Verify that `MONGODB_URI` is defined and correctly formatted.
- Confirm that the Atlas database user exists and has the required permissions.
- Check the Atlas network-access configuration.
- Check the database connection logs.

### Firebase authentication fails on the server

- Confirm that `FIREBASE_SERVICE_ACCOUNT` is present in the deployed environment.
- Check that the service-account JSON is valid and parsed in the format expected by the Firebase Admin module.
- Ensure the client sends a valid Firebase ID token.
- Check the token-verification error in the server logs.

### A deployed endpoint times out

- Confirm that the server connects to MongoDB Atlas rather than localhost.
- Check the runtime logs for connection failures.
- Verify the deployment environment variables.
- Check that the client is calling the deployed API URL.

### A user can modify another user's item

Enforce ownership checks in the backend controller or authorization middleware. Hiding the edit and delete controls in the client is not sufficient.

### `/requests/my` returns an error

- Confirm that the route is registered before `/:id`.
- Confirm that `getMyRequests` is defined and exported.
- Confirm that the route uses authentication middleware.
- Check that the Firebase UID matches the MongoDB user's `firebaseUid`.

## Security

- Keep `.env` out of version control.
- Keep `firebasekey.json` out of version control.
- Never commit private service-account keys or database passwords.
- Verify Firebase ID tokens on protected requests.
- Enforce ownership and authorization on the server.
- Validate IDs, dates, request states, and other client-supplied data.
- Do not trust a client-supplied owner or requester ID.
- Use HTTPS for deployed API communication.
- Avoid exposing full credential values in logs.

## License

No license has been specified yet. Add a license file if you intend to distribute the project under a particular open-source license.
