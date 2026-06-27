# 🛒 Cart Management Microservice

A production-ready, highly optimized Cart Management backend microservice built using **Node.js**, **Express**, and **MongoDB (Mongoose)**. This service handles core e-commerce cart operations while maintaining strict data validation and modular formatting.

---

## ⚙️ Installation & Local Setup

1. **Clone the repository:**

  ```bash
   git clone <repository-url>
   cd trackzio-backend-assessment
   ```

   Install node dependencies:
   ```bash
   npm install
   ```


## 📂 Project Folder Structure

Here is an overview of how the project files and directories are organized:

```text
trackzio-backend-assessment/
├── config/
│   └── db.js                # MongoDB connection configuration
|   └── env.config.js        # For centralized environment configuration
├── controllers/
│   └── cartController.js    # Handles API request and response logic
├── middlewares/
|   └── auth.js              # Dedicated file for managing user identity checking
│   └── errorHandler.js      # Global centralized error handling middleware
├── models/
│   └── cartmodel.js         # Mongoose Schema for the User Cart
│   └── productmodel.js      # Mongoose Schema for Products & Inventory
|   └── usermodel.js         # Mongoose Schema for User
├── routes/
│   └── cartRoutes.js        # Defines API route endpoints mapping
├── utils/
|   └──catchAsync.js         # A utility wrapper that catches asynchronous errors and passes them to the global error handler
│   └── itemExpiryHelper.js  # Checks and filters 7-day expired items
│   └── inventoryHelper.js   # Validates live inventory/warehouse stock
│   └── campaignHelper.js    # Calculates promotional matrix and best discount
├── .env                     # Local environment variables (Secret keys)
├── index.js                 # Main Express application entry point
├── design.md                # System design and core logic documentation
├── package.json             # Project dependencies and startup scripts
└── README.md                # Project setup and overview guide

```

## 🔧 Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/trackzio
```


Start the Development Server:
```bash
   npm start
```


## API Endpoints
>Note: Every API request must pass the User's Database ID(_id) in the headers as x-user-id.
this x-user-id key is used to access the correct cart of the user

1. Add Item to Cart
URL: POST /api/cart/:productId
Headers: { "x-user-id": "USER_DATABASE_ID" }
Body: { "quantity": 2 }


2. Update Cart Quantity
URL: PUT /api/cart/:productId
Headers: { "x-user-id": "USER_DATABASE_ID" }

3. Remove Item From Cart
URL: DELETE /api/cart/:productId
Headers: { "x-user-id": "USER_DATABASE_ID" }

 