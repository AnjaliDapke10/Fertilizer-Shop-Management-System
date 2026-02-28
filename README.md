# 🌱 Fertilizer Shop Management System

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
A full-stack, transaction-safe, batch-based inventory and billing system designed for real-world fertilizer retailers.

Currently, two official plugins are available:
This system models real agricultural retail workflows including:
- Batch-wise inventory management
- FIFO stock deduction
- Expiry tracking
- Credit sales & payment tracking
- Printable invoices
- Inventory ledger for audit safety

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
---

## React Compiler
## 🚀 Features

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
### 📦 Inventory Management
- Batch-based stock tracking
- Expiry date monitoring
- FIFO (First In First Out) allocation
- Stock deduction at batch level
- Inventory ledger (IN / OUT tracking)

## Expanding the ESLint configuration
### 🛒 Purchase Module
- Supplier management
- Batch creation per purchase
- Automatic stock entry
- Purchase invoice tracking

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
### 💳 Sales & Billing
- Dynamic invoice creation
- FIFO stock deduction during sale
- Partial & full payment support
- Sale status lifecycle (pending / completed)
- Printable invoice view
- Thermal print compatible layout

### 💰 Payment System
- Record multiple payments per sale
- Automatic status update
- Credit tracking

### 📊 Reports
- Sales summary
- Stock summary
- Inventory movement
- Revenue tracking

---

## 🏗 System Architecture

The system follows a clean layered architecture:

- Frontend handles UI & state
- Backend enforces business logic
- Database ensures data integrity

---

## 🧠 Core Design Concepts

### 1️⃣ Batch-Based Inventory
Stock is not stored in products.
Each purchase creates a batch with its own:
- Quantity
- Cost price
- Expiry date

### 2️⃣ FIFO Allocation
During sale:
- Oldest batch is deducted first
- Stock reduces at batch level
- Prevents expired inventory accumulation

### 3️⃣ Transaction Safety
Sale creation uses database transactions:
- BEGIN
- Deduct batches
