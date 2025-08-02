# 💸 Digital Wallet System

A secure digital wallet system built with Node.js, Express, MongoDB, and JWT authentication — designed to support role-based access for **Admins**, **Users**, and **Agents**.

---

## 🚀 Features

### ✅ Authentication & Authorization

- JWT-based secure login system
- Role-based access for:
  - **Admin**
  - **User**
  - **Agent**
- Passwords securely hashed using `bcrypt`

### ✅ Wallet System

- Every User and Agent gets a wallet automatically on registration
- Initial wallet balance: ৳50
- Wallets are tied to user accounts and track all transactions

---

## 👥 Role Capabilities

### 🧑‍💼 Admin

- View all **users**, **agents**, **wallets**, and **transactions**
- Block/unblock user wallets
- Approve/suspend agents

### 🧑 User

- Add money to own wallet (Top-Up)
- Withdraw money from own wallet
- Send money to another user
- View personal transaction history

### 🧑 Agent

- Add money to any user's wallet (Cash-In)
- Withdraw money from any user's wallet (Cash-Out)

---

## 📦 Core Modules

- `User` — Contains user data and roles
- `Wallet` — Stores balance and transaction reference
- `Transaction` — Logs all types of money movement
- `Auth` — Handles registration, login, JWT issuance
- `Middleware` — Protects routes and enforces role-based access

---

## 🔐 Security

- JWT used for all protected routes
- Strong password hashing using `bcrypt`
- Route-level role protection middleware implemented

---

## 📄 Transaction Types

- **TOP_UP** — Add money to own wallet
- **CASH_IN** — Agent adds money to user's wallet
- **CASH_OUT** — Agent withdraws from user's wallet
- **TRANSFER** — User sends money to another user

---

## 🧪 Testing & Validation

- All major actions tested for success and failure cases
- Error handling with proper HTTP status codes and messages

---

## 🔧 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Auth**: JWT
- **Password Security**: bcrypt

---

# 📱 Digital Wallet API

### ✅ Login

- **Method:** `POST`
- **URL:** `/api/v1/auth/login`
- **Access:** Public
- **Request Body:**

```json
{
  "email": "fahimkhandakar01@gmail.com",
  "password": "123456"
}
```

### ✅ Create User

- **Method:** `POST`
- **URL:** `/api/v1/user/register`
- **Access:** Public
- **Request Body:**

```json
{
  "name": "john doe",
  "email": "john@doe.com",
  "password": "F@123456",
  "phone": "01903994110"
}
```

### ✅ Create Admin

- **Method:** `POST`
- **URL:** `/api/v1/user/register`
- **Access:** Public
- **Request Body:**

```json
{
  "name": "john doe",
  "email": "john@doe.com",
  "role": "ADMIN",
  "password": "F@123456",
  "phone": "01903994111"
}
```

### ✅ Create Agent

- **Method:** `POST`
- **URL:** `/api/v1/user/register`
- **Access:** Public
- **Request Body:**

```json
{
  "name": "john doe",
  "email": "john@doe.com",
  "role": "AGENT",
  "password": "F@123456",
  "phone": "01903994112"
}
```

### ✅ Update User

- **Method:** `PATCH`
- **URL:** `/api/v1/user/id`
- **Access:** ADMIN/AGENT/USER
- **Request Body:**

```json
{
  "name": "john doe",
  "email": "john@doe.com",
  "role": "AGENT",
  "password": "F@123456",
  "phone": "01903994112"
}
```

### ✅ Get Users

- **Method:** `GET`
- **URL:** `/api/v1/user/all-users`
- **Access:** ADMIN

### ✅ Get Single User

- **Method:** `GET`
- **URL:** `/api/v1/user/id`
- **Access:** ADMIN

### ✅ Get Current User

- **Method:** `GET`
- **URL:** `/api/v1/user/me`
- **Access:** ADMIN/USER/AGENT

### ✅ Create Transaction (TOP_UP)

- **Method:** `POST`
- **URL:** `/api/v1/transaction/create-transaction`
- **Access:** ADMIN/USER/AGENT
- **Request Body:**

```json
{
  "amount": 500,
  "type": "TOP_UP"
}
```

### ✅ Create Transaction (TRANSFER)

- **Method:** `POST`
- **URL:** `/api/v1/transaction/create-transaction`
- **Access:** ADMIN/AGENT/USER
- **Request Body:**

```json
{
  "amount": 500,
  "type": "TRANSFER",
  "sendTo": "01533634831"
}
```

### ✅ Create Transaction (CASH_IN)

- **Method:** `POST`
- **URL:** `/api/v1/transaction/create-transaction`
- **Access:** ADMIN/AGENT
- **Request Body:**

```json
{
  "amount": 500,
  "type": "CASH_IN",
  "sendTo": "01533634831"
}
```

### ✅ Create Transaction (CASH_OUT)

- **Method:** `POST`
- **URL:** `/api/v1/transaction/create-transaction`
- **Access:** ADMIN/AGENT
- **Request Body:**

```json
{
  "amount": 500,
  "type": "CASH_OUT",
  "sendTo": "01533634831"
}
```

### ✅ Update Transaction

- **Method:** `PATCH`
- **URL:** `/api/v1/transaction/id`
- **Access:** ADMIN/AGENT/USER
- **Request Body:**

```json
{
  "amount": 500,
  "type": "CASH_OUT",
  "sendTo": "01533634831"
}
```

### ✅ Get Transactions

- **Method:** `GET`
- **URL:** `/api/v1/transaction/all-transactions`
- **Access:** ADMIN

### ✅ Get Single Transaction

- **Method:** `GET`
- **URL:** `/api/v1/transaction/id`
- **Access:** ADMIN

### ✅ Get My Transactions

- **Method:** `GET`
- **URL:** `/api/v1/transaction/my-transactions`
- **Access:** ADMIN/AGENT/USER

### ✅ Get Wallets

- **Method:** `GET`
- **URL:** `/api/v1/wallet/all-wallets`
- **Access:** ADMIN

### ✅ Get Single Wallet

- **Method:** `GET`
- **URL:** `/api/v1/wallet/id`
- **Access:** ADMIN

### ✅ Get My Wallet

- **Method:** `GET`
- **URL:** `/api/v1/wallet/my-wallet`
- **Access:** ADMIN/AGENT/USER

## 📌 Environment Variables (`.env`)

PORT=5000
DB_URL=mongodb+srv://your-db-name:your-db-pass@cluster0.p0m1q4c.mongodb.net/digital-wallet-db?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development

# JWT

JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES=3d
JWT_REFRESH_SECRET=JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES=30d

# BCRYPT

BCRYPT_SALT_ROUND=10

# SUPER ADMIN

ADMIN_EMAIL=fahimkhandakar01@gmail.com
ADMIN_PASSWORD=123456

```

```
