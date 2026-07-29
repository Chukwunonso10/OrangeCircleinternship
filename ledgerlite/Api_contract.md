# LedgerLite API Contract Documentation

This document outlines the API contracts for the **LedgerLite** Next.js application, including endpoints, request/response structures, authentication, and known database-backed operations.

---

## Authentication Overview

LedgerLite uses **Session-based Authentication** managed via a cookie.

* **Cookie Name**: `sessionToken`
* **Expiration**: 24 hours from creation
* **Cookie Attributes**: `HttpOnly`, `Secure` (in production), `SameSite=Lax`, `Path=/`

### Protected Routes
All endpoints under `/api/routes/*` and `/api/(auth)/protected/*` require a valid `sessionToken` cookie. 

> - Client integrations **must** check both the HTTP status code and the `success` field in the JSON body.

---

## Database Models Reference

Below are the Prisma-defined schemas for request and response payloads mapping:

| Model | Fields |
| :--- | :--- |
| **User** | `id` (cuid), `name`, `buisnessName`, `email`, `isVerified`, `createdAt`, `updatedAt` |
| **Session** | `id` (cuid), `sessionToken`, `userId`, `expiresAt`, `createdAt` |
| **Item** | `id` (cuid), `name` (unique), `lowStock` (default 5), `currentStock` (default 0), `createdAt`, `updatedAt`, `userId` |
| **Sale** | `id` (cuid), `unitPrice` (Decimal), `quantity` (Int, default 1), `totalAmount` (Decimal), `customItemName` (String?), `itemId` (String?), `createdAt`, `updatedAt`, `userId` |
| **Expense** | `id` (cuid), `amount` (Decimal), `description` (Text?), `category` (String), `createdAt`, `updatedAt`, `userId` |

---

## API Endpoint Reference

### 1. Authentication & Profile Endpoints

#### POST `/api/sign-up`
Registers a new user business account or triggers a retry for an unverified account.
* **Method**: `POST`
* **Auth Required**: No
* **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "buisnessName": "My Store",
    "password": "securepassword123",
    "confirmPassword": "securepassword123"
  }
  ```
* **Responses**:
  * **`201 Created`**: User created or password reset for unverified account. Verification code sent.
    ```json
    {
      "success": true,
      "message": "user Account successfully created. verification email sent!",
      "userId": "cuid_here",
      "sendMail": { ... }
    }
    ```
  * **`400 Bad Request`**: Missing credentials, passwords mismatch, invalid email format, password < 8 characters, or verified user already exists.
    ```json
    {
      "success": false,
      "message": "invalid email address"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### POST `/api/sign-in`
Signs a user in and sets the `sessionToken` cookie.
* **Method**: `POST`
* **Auth Required**: No
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
* **Responses**:
  * **`200 OK`**: Successfully signed in.
    ```json
    {
      "success": true,
      "message": "user successfully signed in",
      "user": {
        "userId": "cuid_here",
        "email": "user@example.com",
        "buisnessName": "My Store",
        "name": "John Doe"
      }
    }
    ```
  * **`400 Bad Request`**: Missing parameters, invalid email, password < 8 characters, password incorrect, or email unverified.
    ```json
    {
      "success": false,
      "message": "password is incorrect"
    }
    ```
  * **`404 Not Found`**: Account does not exist.
    ```json
    {
      "success": false,
      "message": "Account Not Found"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### POST `/api/verifyEmail`
Verifies the user account using the 6-digit code received in email.
* **Method**: `POST`
* **Auth Required**: No
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "code": "123456"
  }
  ```
* **Responses**:
  * **`200 OK`**: Account verified and logged in.
    ```json
    {
      "success": true,
      "message": "user successfully verified"
    }
    ```
  * **`400 Bad Request`**: Missing parameters, already verified, or invalid token.
    ```json
    {
      "success": false,
      "message": "invalid verification Token"
    }
    ```
  * **`404 Not Found`**: 
    > [!IMPORTANT]
    > Returns HTTP status `404` but JSON body says `success: true`:
    ```json
    {
      "success": true,
      "message": "This user does not exist!!"
    }
    ```
  * **`200 OK (Expired Session)`**: If token expiration check fails.
    ```json
    {
      "success": false,
      "message": "session already expired"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "internal server Error"
    }
    ```

#### POST `/api/protected/logout`
Destroys the current user session.
* **Method**: `POST`
* **Auth Required**: Yes
* **Responses**:
  * **`200 OK`**: Logged out successfully.
    ```json
    {
      "success": true,
      "message": "logged out successfully"
    }
    ```
  * **`200 OK (Deletion Failure)`**: 
    ```json
    {
      "success": false,
      "message": "Error deleting session token"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### GET `/api/protected/profile`
Retrieves the logged-in user profile details.
* **Method**: `GET`
* **Auth Required**: Yes
* **Responses**:
  * **`200 OK`**: Profile retrieved.
    ```json
    {
      "success": true,
      "message": "successfull",
      "profile": {
        "id": "cuid_here",
        "name": "John Doe",
        "buisnessName": "My Store",
        "email": "user@example.com",
        "isVerified": true,
        "createdAt": "2026-07-19T06:05:00.000Z"
      }
    }
    ```
  * **`403 Forbidden`**: Unauthorized request.
    ```json
    {
      "success": false,
      "message": "Unauthorized!"
    }
    ```

#### PATCH `/api/protected/profile`
Updates profile properties (Name, Business Name, or Password).
* **Method**: `PATCH`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",              // Optional
    "buisnessName": "Jane's Store",  // Optional
    "password": "oldpassword123",    // Required only if changing password
    "newPassword": "newpassword123"  // Optional
  }
  ```
* **Responses**:
  * **`200 OK`**: Successfully updated. If `newPassword` was updated, all active sessions are revoked.
    ```json
    {
      "success": true,
      "message": "Password Changed. All active sessions has been deleted!",
      "updated": { ... }
    }
    ```
  * **`403 Forbidden`**: Unauthorized session.
    ```json
    {
      "success": false,
      "message": "Unauthorized!"
    }
    ```
  * **`400 Bad Request`**: New password length < 8.
    ```json
    {
      "success": false,
      "message": "passwords must be 8 characters long"
    }
    ```
  * **`200 OK (Incorrect Password)`**: If updating password but current password validation fails.
    ```json
    {
      "success": false,
      "message": "incorrect password"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "Internal server error"
    }
    ```

---

### 2. Product Items Management

#### GET `/api/routes/item`
Retrieves all items belonging to the current user.
* **Method**: `GET`
* **Auth Required**: Yes
* **Responses**:
  * **`200 OK`**: Items retrieved.
    ```json
    {
      "success": true,
      "message": "successfully retrieved products",
      "allProducts": [
        {
          "id": "cuid_here",
          "name": "Item A",
          "lowStock": 5,
          "currentStock": 20,
          "createdAt": "2026-07-19T06:05:00.000Z",
          "updatedAt": "2026-07-19T06:05:00.000Z",
          "userId": "user_cuid"
        }
      ]
    }
    ```
  * **`404 Not Found`**: 
    ```json
    {
      "success": true,
      "message": "No products found in the database!"
    }
    ```
  * **`401 Unauthorized`**:
    ```json
    {
      "success": false,
      "message": "unauthorized: pls log in to continue"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### POST `/api/routes/item`
Creates a new product item or syncs an existing one. Supports offline sync operations via `operationId`.
* **Method**: `POST`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid",
    "id": "optional-item-id-for-upsert",
    "name": "Product Name",
    "lowStock": 5,
    "currentStock": 10,
    "createdAt": "2026-07-19T06:05:00.000Z" // Optional
  }
  ```
* **Responses**:
  * **`201 Created`**: Product created or updated successfully.
    ```json
    {
      "success": true,
      "message": "product created successfully",
      "productItem": { ... }
    }
    ```
  * **`200 OK`**: If already synced.
    ```json
    {
      "success": false,
      "message": "product already synced!!"
    }
    ```
  * **`400 Bad Request`**: Name missing, or stocks are negative.
    ```json
    {
      "success": false,
      "message": "Bad Request: Name is required!"
    }
    ```
  * **`401 Unauthorized`**:
    ```json
    {
      "success": false,
      "message": "unauthorized: pls log in to continue"
    }
    ```
  * **`500 Internal Server Error`**: If user attempts to modify a product they do not own (forbidden check throws an error).
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### PUT `/api/routes/item/[itemId]`
Updates fields of a specific item.
* **Method**: `PUT`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid",
    "name": "New Product Name",
    "lowStock": 3,
    "currentStock": 15
  }
  ```
* **Responses**:
  * **`200 OK`**: Update completed.
    ```json
    {
      "success": true,
      "message": "successfully updated item",
      "updatedProduct": { ... }
    }
    ```
  * **`200 OK (Unauthorized)`**: If not logged in.
    ```json
    {
      "success": false,
      "message": "unauthorized: pls log in"
    }
    ```
  * **`200 OK (Already Synced)`**:
    ```json
    {
      "success": false,
      "message": "product update already synced!!"
    }
    ```
  * **`400 Bad Request`**: Empty update fields or negative stock counts.
    ```json
    {
      "success": false,
      "message": "Bad Request: Update fields cannot be empty"
    }
    ```
  * **`403 Forbidden`**: User does not own the item.
    ```json
    {
      "success": false,
      "message": "Forbidden: you do not own this product"
    }
    ```
  * **`404 Not Found`**:
    ```json
    {
      "success": false,
      "message": "Product Not found!"
    }
    ```

#### DELETE `/api/routes/item/[itemId]`
Deletes a specific product item.
* **Method**: `DELETE`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid"
  }
  ```
* **Responses**:
  * **`200 OK`**: Item deleted.
    ```json
    {
      "success": true,
      "message": "successfully deleted item",
      "deleted": { ... }
    }
    ```
  * **`200 OK (Unauthorized)`**: If not logged in.
    ```json
    {
      "success": false,
      "message": "unauthorized: pls log in"
    }
    ```
  * **`200 OK (Already Synced)`**:
    ```json
    {
      "success": true,
      "message": "Already synced!!"
    }
    ```
  * **`403 Forbidden`**: User does not own the item.
    ```json
    {
      "success": false,
      "message": "Forbidden: you do not own this product"
    }
    ```
  * **`404 Not Found`**: Item not found.
    ```json
    {
      "success": false,
      "message": "product does not exist"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": true,
      "message": "internal server error"
    }
    ```

---

### 3. Sales Management

#### GET `/api/routes/sales`
Retrieves all recorded sales logs with their associated item name.
* **Method**: `GET`
* **Auth Required**: Yes
* **Responses**:
  * **`200 OK`**: Sales retrieved.
    ```json
    {
      "success": true,
      "message": "successfully retrieved all sales",
      "data": [
        {
          "id": "cuid_here",
          "unitPrice": "150.00",
          "quantity": 2,
          "totalAmount": "300.00",
          "customItemName": null,
          "itemId": "item_cuid",
          "createdAt": "2026-07-19T06:05:00.000Z",
          "updatedAt": "2026-07-19T06:05:00.000Z",
          "userId": "user_cuid",
          "item": { "name": "Item Name" }
        }
      ]
    }
    ```
  * **`200 OK (Empty)`**: No sales logs recorded.
    ```json
    {
      "success": true,
      "message": "No sales currently recorded"
    }
    ```
  * **`200 OK (Unauthorized)`**: If not logged in.
    ```json
    {
      "success": false,
      "message": "Unauthorize!!: pls log in"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": true,
      "message": "internal server error"
    }
    ```

#### POST `/api/routes/sales`
Records a sale transaction. Decrements inventory count if a tracked `itemId` is supplied.
* **Method**: `POST`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid",
    "id": "optional-sales-cuid",
    "unitPrice": 150,
    "quantity": 2,
    "customItemName": "Untracked item description", // Use if not specifying itemId
    "itemId": "optional-tracked-item-cuid",
    "createdAt": "2026-07-19T06:05:00.000Z"         // Optional
  }
  ```
* **Responses**:
  * **`201 Created`**: Sale completed.
    ```json
    {
      "success": true,
      "message": "item sold successfully"
    }
    ```
  * **`200 OK (Unauthorized)`**: If not logged in.
    ```json
    {
      "success": false,
      "message": "Unauthorized!!, pls log in"
    }
    ```
  * **`200 OK (Already Synced)`**:
    ```json
    {
      "success": false,
      "message": "sales already synced!!"
    }
    ```
  * **`400 Bad Request`**: Quantity or unitPrice is missing or invalid.
    ```json
    {
      "success": false,
      "message": "quantity is required!"
    }
    ```
  * **`500 Internal Server Error`**: Insufficient stock, item not found, forbidden ownership, or DB errors.
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### PUT `/api/routes/sales/[salesId]`
Updates an existing sales log. Recalculates and adjusts tracked item inventory stocks based on quantity delta.
* **Method**: `PUT`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid",
    "unitPrice": 160,
    "quantity": 3,
    "customItemName": "Updated Name",
    "itemId": "updated-item-cuid"
  }
  ```
* **Responses**:
  * **`200 OK`**: Sale updated.
    > [!WARNING]
    > **Contract Inconsistency**
    > 
    > Returns `success: false` despite succeeding:
    ```json
    {
      "success": false,
      "message": "successfully updated sales"
    }
    ```
  * **`200 OK (Unauthorized)`**:
    ```json
    {
      "success": false,
      "message": "Unauthorized!!, pls log in"
    }
    ```
  * **`200 OK (Already Synced)`**:
    ```json
    {
      "success": true,
      "message": "already sync"
    }
    ```
  * **`400 Bad Request`**: Negative values for quantity or unitPrice.
    ```json
    {
      "success": false,
      "message": "Bad Request: quantity must be greater than 0!"
    }
    ```
  * **`403 Forbidden`**: User does not own the sale.
    ```json
    {
      "success": false,
      "message": "Forbidden!!!: you do not own this sales "
    }
    ```
  * **`404 Not Found`**:
    ```json
    {
      "success": false,
      "message": "sales record was not found"
    }
    ```
  * **`500 Internal Server Error`**: Stock constraints, item ownership issues, or server exception.
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### DELETE `/api/routes/sales/[salesId]`
Deletes a sales record. Increments inventory stocks back by the sale quantity if the sale was associated with a tracked `itemId`.
* **Method**: `DELETE`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid"
  }
  ```
* **Responses**:
  * **`200 OK`**: Sale record deleted.
    ```json
    {
      "success": true,
      "message": "Deleted sales record successfully"
    }
    ```
  * **`200 OK (Unauthorized)`**:
    ```json
    {
      "success": false,
      "message": "Unauthorize!!: pls log in"
    }
    ```
  * **`200 OK (Already Synced)`**:
    ```json
    {
      "success": true,
      "message": "already synced!!"
    }
    ```
  * **`200 OK (Already Deleted)`**:
    ```json
    {
      "success": false,
      "message": "sales already deleted"
    }
    ```
  * **`200 OK (Forbidden)`**:
    ```json
    {
      "success": false,
      "message": "Forbidden: you do not own this product!!"
    }
    ```
  * **`500 Internal Server Error`**: Database error.
    ```json
    {
      "success": false,
      "message": "internal serve error"
    }
    ```

---

### 4. Expenses Management

#### GET `/api/routes/expenses`
Retrieves all logged expenses for the authenticated user, ordered chronologically ascending.
* **Method**: `GET`
* **Auth Required**: Yes
* **Responses**:
  * **`200 OK`**: Records retrieved.
    ```json
    {
      "success": true,
      "message": "expenses Record Retrieved successfully!",
      "allExpenses": [
        {
          "id": "cuid_here",
          "amount": "500.00",
          "description": "Office supplies",
          "category": "Utilities",
          "createdAt": "2026-07-19T06:05:00.000Z",
          "updatedAt": "2026-07-19T06:05:00.000Z",
          "userId": "user_cuid"
        }
      ]
    }
    ```
  * **`200 OK (Empty)`**: No records exist.
    ```json
    {
      "success": false,
      "message": "No expenses recorded currently"
    }
    ```
  * **`200 OK (Unauthorized)`**:
    ```json
    {
      "success": false,
      "message": "unauthorized: pls log in"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### POST `/api/routes/expenses`
Creates a new expense log or syncs updates.
* **Method**: `POST`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid",
    "id": "optional-expense-cuid-for-upsert",
    "amount": 250,
    "category": "Travel",
    "description": "Taxi ride",
    "createdAt": "2026-07-19T06:05:00.000Z" // Optional
  }
  ```
* **Responses**:
  * **`200 OK`**: Expense recorded.
    ```json
    {
      "success": true,
      "message": "expenses recorded successfully"
    }
    ```
  * **`200 OK (Already Synced)`**:
    ```json
    {
      "success": true,
      "message": "already synced"
    }
    ```
  * **`400 Bad Request`**: Missing parameters or negative/zero amounts.
    ```json
    {
      "success": false,
      "message": "Enter an expense amount or category"
    }
    ```
  * **`401 Unauthorized`**:
    ```json
    {
      "success": false,
      "message": "unauthorized: pls log in"
    }
    ```
 

#### PUT `/api/routes/expenses/[expenseId]`
Updates an existing expense.
* **Method**: `PUT`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid",
    "amount": 300,
    "description": "Updated taxi ride description",
    "category": "Travel",
    "createdAt": "2026-07-19T06:05:00.000Z"
  }
  ```
* **Responses**:
  * **`200 OK`**: Expense updated.
    ```json
    {
      "success": true,
      "message": "Expenses updated successfully",
      "updatedExpense": { ... }
    }
    ```
  * **`200 OK (Unauthorized)`**:
    ```json
    {
      "success": false,
      "message": "Uauthorized!!, pls log in"
    }
    ```
  * **`200 OK (Already Synced)`**:
    ```json
    {
      "success": false,
      "message": "already synced"
    }
    ```
  * **`403 Forbidden`**: User does not own the expense record.
    ```json
    {
      "success": false,
      "message": "Forbidden: you do not own this expenses"
    }
    ```
  * **`404 Not Found`**: Record not found.
    ```json
    {
      "success": false,
      "message": "Expenses not found!"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```

#### DELETE `/api/routes/expenses/[expenseId]`
Deletes an expense record.
* **Method**: `DELETE`
* **Auth Required**: Yes
* **Request Body**:
  ```json
  {
    "operationId": "optional-sync-uuid"
  }
  ```
* **Responses**:
  * **`200 OK`**: Expense deleted.
    ```json
    {
      "success": true,
      "message": "Expenses Deleted successfully",
      "deleted": { ... }
    }
    ```
  * **`200 OK (Unauthorized)`**:
    ```json
    {
      "success": false,
      "message": "Uauthorized!!, pls log in"
    }
    ```
  * **`200 OK (Already Synced)`**:
    ```json
    {
      "success": true,
      "message": "already synced"
    }
    ```
  * **`200 OK (Already Deleted)`**:
    ```json
    {
      "success": false,
      "message": "This Expenses has Aready been deleted"
    }
    ```
  * **`200 OK (Forbidden)`**:
    ```json
    {
      "success": false,
      "message": "Forbidden: You do not own this expenses"
    }
    ```
  * **`500 Internal Server Error`**:
    ```json
    {
      "success": false,
      "message": "internal server error"
    }
    ```
