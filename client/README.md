# 🌱 Fertilizer Shop Management System

A full-stack, transaction-safe, batch-based inventory and billing system designed for real-world fertilizer retailers.

This system models real agricultural retail workflows including:
- Batch-wise inventory management
- FIFO stock deduction
- Expiry tracking
- Credit sales & payment tracking
- Printable invoices
- Inventory ledger for audit safety

---

## 🚀 Features

### 📦 Inventory Management
- Batch-based stock tracking
- Expiry date monitoring
- FIFO (First In First Out) allocation
- Stock deduction at batch level
- Inventory ledger (IN / OUT tracking)

### 🛒 Purchase Module
- Supplier management
- Batch creation per purchase
- Automatic stock entry
- Purchase invoice tracking

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