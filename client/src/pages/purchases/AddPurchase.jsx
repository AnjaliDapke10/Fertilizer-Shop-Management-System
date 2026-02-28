import { useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { createPurchase } from "../../services/purchaseService";

const AddPurchase = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    supplier_id: "",
    product_id: "",
    quantity: "",
    price: "",
    invoice: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createPurchase({
      supplier_id: form.supplier_id,
      purchase_date: form.date,
      invoice_number: form.invoice,
      items: [
        {
          product_id: form.product_id,
          quantity: Number(form.quantity),
          purchase_price: Number(form.price),
        },
      ],
    });

    onSave();
  };

  return (
    <Modal title="Add New Purchase" onClose={onClose}>
      <p className="text-muted">Record a new purchase order</p>

      <div className="grid-2 mt-3">
        <Input
          label="Supplier"
          name="supplier_id"
          placeholder="Select supplier"
          value={form.supplier_id}
          onChange={handleChange}
        />

        <Input
          label="Product"
          name="product_id"
          placeholder="Select product"
          value={form.product_id}
          onChange={handleChange}
        />
      </div>

      <div className="grid-2">
        <Input
          label="Quantity"
          name="quantity"
          placeholder="Enter quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        <Input
          label="Price per Unit (₹)"
          name="price"
          placeholder="Enter price per unit"
          value={form.price}
          onChange={handleChange}
        />
      </div>

      <div className="grid-2">
        <Input
          label="Invoice Number"
          name="invoice"
          placeholder="Enter invoice number"
          value={form.invoice}
          onChange={handleChange}
        />

        <Input
          label="Purchase Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-primary" onClick={handleSubmit}>
          Add Purchase
        </button>
      </div>
    </Modal>
  );
};

export default AddPurchase;
