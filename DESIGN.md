```markdown
# 🛠️ System Design & Core Business Logic Architecture

This document outlines the underlying design patterns, decoupling strategies, data models, and specialized algorithms implemented within the Cart Management system.

---


## 🔄 Code Execution Order (Pipeline)

To keep the controllers clean and follow the Single Responsibility Principle, every time a user changes the cart, the code runs in this exact order:

1. **`filterExpiredItems`:** First, it automatically removes items that are older than 7 days.
2. **`validateStock`:** Next, it checks if the requested quantity is available in the product inventory (only for Add/Update operations)
3. **`calculateCampaignDiscount`:** Then, it recalculates the subtotal, discounts, and grand total based on active offers.
4. **`cart.save()`:** Finally, after all checks are successful, it saves the updated cart data to MongoDB.

---

### X-Features -
* **Item-Level 7 Day Expiry**
* **Intelligent Campaign Selection Matrix**
* **Live Inventory Guard (`validateStock`)**

---
## 🚀 Key Features Explained

### 1. Header-Based User Tracking (`x-user-id`)
* Instead of using complex login sessions, we track users using a custom header called `x-user-id`.
* The client passes the user's database `_id` inside this header.
* The controller extracts this ID (`req.userId`) and fetches the correct cart using `Cart.findOne({ userId })`. This ensures that users can only see and change their own carts.

### 2. Item-Level 7 Day Cart Expiry
* **The Problem:** Standard MongoDB TTL deletes the entire cart when it expires, which ruins the user experience.
* **Our Solution:** Every cart item stores its own `addedAt` timestamp, allowing items to expire independently.
* **How it works:** When any API is called, our helper checks if an item is older than 7 days. If yes, it removes only that specific item and updates the bill instantly.

### 3. Live Inventory Guard (`validateStock`)
* To stop users from buying more than the available stock, we use a `validateStock` helper inside both `addToCart` and `updateCartQuantity`.
* If a user tries to add a quantity that is greater than the available stock, the helper stops the execution immediately and returns a `400 Bad Request` error.

### 4. Smart Campaign Discount Engine
We calculate the **Best Discount** for the user using three simple rules:
* **`MEGA_SAVER`:** Gives a flat 10% discount if the cart Subtotal is 5000 or more.
* **`CATEGORY_DIVERSITY_BONUS`:** Uses an ES6 `Set` to check how many unique categories are in the cart. If there are 3 or more categories, the user gets a flat ₹300 discount.
* **`SPECIAL_BONUS`:** If the cart has a Subtotal >= 5000 AND >= 3 unique categories, the user gets a flat 20% discount.

---
## 🛡️ Robust Error Handling & Edge Cases

To prevent server crashes and ensure data security, the microservice handles various edge cases and errors gracefully:

### 1. Database Connection & Document Safety
* **Invalid Product/User IDs:** If a user passes a corrupted or malformed MongoDB Object ID in the URL or headers, the system catches it early and throws a clean `400 Bad Request` instead of letting the database crash.
* **Missing Cart Handling:** If a new user hits the update or remove endpoints before creating a cart, the code automatically creates an empty cart structure or returns a successful `200 OK` with an empty items array rather than breaking with a `Null Pointer` error.

### 2. Edge Cases in Inventory Check (`validateStock`)
* **Zero or Negative Quantities:** If someone tries to pass a negative number or zero (`quantity: -5` or `0`) via API tools like Postman to exploit the cart, the schema validation and controller block it instantly with a custom error message: `Quantity cannot be less than 1.`
* **Mid-Shopping Stock Changes:** If an item is in the user's cart, but the admin decreases the product stock in the database, our double-ended validation re-checks the live stock on every cart update. If the stock falls short, it blocks the update immediately.

### 3. Graceful Campaign & Expiry Fail-Safes
* **Empty Cart After Expiry:** If a user opens their cart after 7 days and *all* items are expired, the `filterExpiredItems` helper clears the entire array. The Campaign Engine then safely sets the `subTotal`, `discountAmount`, and `grandTotal` to `0` and sets `appliedCampaign` to `"NONE"` without throwing any mathematical errors.
* **Missing Header Protection:** If the `x-user-id` header is completely missing from the request, the controller catches it immediately and returns a `401 Unauthorized access` error to stop unauthorized access.

---

## ⚙️ Middlewares & Global Error Handling

To keep the application safe from unexpected crashes and avoid repetitive try-catch blocks, we use custom middlewares and an asynchronous error wrapper.

### 1. The `catchAsync` Wrapper
* **Why we use it:** Writing `try-catch` blocks inside every async controller function makes the code messy and bloated. 
* **How it works:** `catchAsync` is a higher-order utility function that wraps around our async route handlers. If any error occurs inside the logic (like database disconnection or runtime failures), it catches the promise rejection and automatically forwards it to the global error middleware using `next(err)`. This keeps our controllers clean and strictly adheres to the Single Responsibility Principle.

### 2. Custom Middlewares Implemented
The microservice uses a modular middleware architecture to process requests before and after reaching the main logic:

* **Global Error Handling Middleware (`errorHandler.js`):** This is the final safety net of our application. Whenever an error is forwarded via `next(err)`, this centralized middleware intercepts it, formats the error object, and returns a clean, structured JSON response (e.g., Status Code `400` or `500` with an accurate error message) back to the client. It completely prevents the server from crashing or exposing internal stack traces.
* **Request Parsers:** Standard built-in Express middlewares (`express.json()`) is utilized to cleanly parse incoming JSON payloads before they hit the routing pipelines.

---

## 📌 Design Principles Followed

- Single Responsibility Principle (SRP)
- Separation of Concerns
- Modular Helper-Based Architecture
- Reusable Utility Functions
- Centralized Error Handling
- Clean Controller Structure


## 🗄️ Core Database Models
```js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId : {type : mongoose.Schema.Types.ObjectId, ref : 'Product', required : true},
    quantity : {type : Number, required : true, min : [1, "Quantity must be atleast 1"],default : 1},
    category : {type : String, required : true},
    priceAtaddition : {type : Number, required : true},
    addedAt : {type : Date, default : Date.now}
},{_id : false});


const cartSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId,ref : 'User', required : true,unique : true },
    items : [cartItemSchema],
    subTotal : {type : Number, required : true, default : 0},
    discountAmount : {type : Number, required : true, default : 0},
    grandTotal : {type : Number, required : true,default : 0},
    appliedCampaign : {type : String, default : null}
});

module.exports = mongoose.model('Cart',cartSchema);
```