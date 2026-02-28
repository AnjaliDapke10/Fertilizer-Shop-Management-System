import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import ProductSelect from "./ProductSelect";
import { calculateBill } from "./billUtils";
import { createSale } from "../../services/salesService";
import { getCustomers } from "../../services/customerService";

const PRODUCTS = [
  { id: 1, name: "Urea 46% Nitrogen", price: 30 },
  { id: 2, name: "DAP", price: 42 },
  { id: 3, name: "NPK 20-20-20", price: 55 },
];

const NewSale = ({ onClose, onSave }) => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    discount: 0,
  });

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  const selectedProduct = PRODUCTS.find(
    (p) => p.id === Number(form.product_id)
  );

  const addItem = () => {
    if (!form.product_id || !form.quantity) return;

    setItems([
      ...items,
      {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        quantity: Number(form.quantity),
        unit_price: selectedProduct.price,
        discount: Number(form.discount || 0),
      },
    ]);

    setForm({ product_id: "", quantity: "", discount: 0 });
  };

  const bill = calculateBill(items);

  const submit = async () => {
    if (!items.length) return alert("Add at least one product");

    await createSale({
      customer_id: customerId || null,
      sale_date: new Date().toISOString().slice(0, 10),
      invoice_number: "INV-" + Date.now(),
      items: items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        selling_price: i.unit_price,
      })),
    });

    onSave();
  };

  return (
    <Modal
  title="New Sale / Invoice"
  onClose={onClose}
  footer={
    <>
      <button className="btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button className="btn-secondary" onClick={() => window.print()}>
        Print Invoice
      </button>
      <button className="btn-primary" onClick={submit}>
        Save Invoice
      </button>
    </>
  }
>

  {/* INVOICE HEADER (PRINT ONLY) */}
<div className="invoice-header-print">
  <h2>Fertilizer Shop</h2>
  <p>Authorized Fertilizer Dealer</p>
  <p>GSTIN: 27ABCDE1234F1Z5</p>
  <hr />

  <div className="invoice-meta">
    <div>
      <b>Invoice No:</b> INV-{Date.now()}
    </div>
    <div>
      <b>Date:</b> {new Date().toLocaleDateString()}
    </div>
    <div>
      <b>Customer:</b>{" "}
      {customers.find(c => c.id == customerId)?.name || "Walk-in Customer"}
    </div>
    <div>
      <b>Payment:</b> {paymentMethod.toUpperCase()}
    </div>
  </div>
</div>

  {/* ✅ PRINTABLE AREA */}

  <div className="print-area thermal">
    <div className="grid gap-16">

      {/* CUSTOMER + PAYMENT */}
      <div className="grid grid-2 gap-12">
        <div>
          <label>Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Walk-in Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank</option>
          </select>
        </div>
      </div>

      {/* ADD PRODUCTS */}
      <div className="card">
        <h4>Add Products</h4>
        <div className="grid grid-5 gap-8">
          <ProductSelect
            products={PRODUCTS}
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: e.target.value })
            }
          />

          <Input
            placeholder="Qty"
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <Input
            placeholder="Discount ₹"
            type="number"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: e.target.value })
            }
          />

          <Input value={`₹${selectedProduct?.price || 0}`} disabled />

          <button className="btn-primary" onClick={addItem}>
            + Add
          </button>
        </div>
      </div>

      {/* SALE ITEMS */}
      {items.length > 0 && (
        <div className="card">
          <h4>Sale Items</h4>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.product_name}</td>
                  <td>{i.quantity}</td>
                  <td>₹{i.unit_price}</td>
                  <td>₹{i.discount}</td>
                  <td>₹{i.quantity * i.unit_price - i.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BILL SUMMARY */}
      <div className="card">
        <h4>Bill Summary</h4>
        <div>Subtotal: ₹{bill.subtotal}</div>
        <div>Discount: -₹{bill.discount}</div>
        <div>GST (18%): ₹{bill.gst}</div>
        <hr />
        <b>Grand Total: ₹{bill.grandTotal}</b>
      </div>

    </div>
  </div>
</Modal>

  );
};

export default NewSale;
