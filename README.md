# Military-Asset-Management

A web-based military asset tracking and operational overview portal designed to maintain real-time asset visibility, log inventory movements across bases, and track unit assignments and expenditures.

---

## Features

* **Operational Overview Dashboard:** Dynamic metric visualization calculating **Net Movement** (`Purchases + Transfers In - Transfers Out`) and **Closing Balance** (`Net Movement - Assigned - Expended`).
* **Asset Acquisitions (Purchases):** Record purchase orders for equipment types assigned to specific military destination bases.
* **Cross-Base Transfers:** Manage and audit stock movements between source and destination bases with timestamp tracking.
* **Assignments & Expenditures:** Log active equipment unit allocations to operational forces and track consumed/expended stock.
* **Authentication & Authorization:** JWT-based user authentication with password hashing using `bcryptjs` and role-based route protection.

---

## Tech Stack

* **Frontend:** React.js, React Router (v6), Lucide React (Icons)
* **Backend:** Node.js, Express.js
* **Database:** MySQL (Hosted on Aiven MySQL with SSL encryption)
* **Authentication:** JSON Web Tokens (JWT), `bcryptjs`

---

## Project Structure

```text
military-asset-management/
├── backend/
│   ├── config/
│   │   └── db.js                 # Aiven MySQL database connection
│   ├── controllers/
│   │   ├── assetController.js    # Business logic for metrics, metadata, purchases, transfers, assignments
│   │   └── authController.js     # User login & profile endpoints
│   ├── middlewares/
│   │   └── authMiddleware.js     # JWT token verification middleware
│   ├── routes/
│   │   ├── assetRoutes.js        # Protected asset management API routes
│   │   └── authRoutes.js         # Authentication routes
│   ├── fixPassword.js            # Admin user password utility script
│   ├── setupDb.js                # Database schema initialization script
│   └── server.js                 # Express server entry point
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Assignments.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Purchases.jsx
    │   │   └── Transfers.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json

```
## Getting Started
Prerequisites
Node.js (v18 or higher)

npm (Node Package Manager)

## Installation

1.Clone the repository:
```
git clone [https://github.com/YOUR_USERNAME/military-asset-management.git] 

cd military-asset-management
```
2.Setup Backend:
```
cd backend

npm install
```
3.Initialize Database Tables & Admin User:
```
node setupDb.js

node fixPassword.js
```
4.Start the Backend Server:
```
npm run dev
```
5.Setup Frontend:
  ```
Open a new terminal window:

cd frontend

npm install

npm run dev
```
## Default Credentials

Field    |  Value         
         |
Username |  admin_user    
         |
Password |  AdminPass123! 

## API Endpoints

Authentication

   POST /api/v1/auth/login – Authenticate user and receive JWT token

   GET /api/v1/auth/me – Get authenticated user details
______________________________________________________________________________________
Asset Management (Protected Routes)

   GET /api/v1/assets/metrics – Get dynamic dashboard overview metrics

   GET /api/v1/assets/metadata – Get list of military bases and equipment types for dropdowns

   GET /api/v1/assets/purchases – Get purchase order history

   POST /api/v1/assets/purchases – Record a new purchase order

   GET /api/v1/assets/transfers – Get cross-base transfer history

   POST /api/v1/assets/transfers – Record a new stock transfer

   GET /api/v1/assets/assignments – Get assignment and expenditure history

   POST /api/v1/assets/assignments – Log a new assignment or operational expenditure