import { useState } from "react";
import { createProduct } from "../../services/productService";

const AddProduct = ({ onClose, onSuccess }) => {

  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "Kg",
    stock: "",
    purchase_price: "",
    selling_price: "",
    reorder_level: "",
    expiry_date: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await createProduct(form);

    onSuccess();
    onClose();

  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h3>Add New Product</h3>

          <button onClick={onClose}>✕</button>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
          >
            <option>Kg</option>
            <option>Litre</option>
            <option>Bag</option>
          </select>

          <input
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
          />

          <input
            name="purchase_price"
            placeholder="Purchase Price"
            value={form.purchase_price}
            onChange={handleChange}
          />

          <input
            name="selling_price"
            placeholder="Selling Price"
            value={form.selling_price}
            onChange={handleChange}
          />

          <input
            name="reorder_level"
            placeholder="Reorder Level"
            value={form.reorder_level}
            onChange={handleChange}
          />

          <input
            type="date"
            name="expiry_date"
            value={form.expiry_date}
            onChange={handleChange}
          />

          <div className="modal-actions">

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="btn-primary">
              Add Product
            </button>

          </div>

        </form>

      </div>

    </div>

  );
};

export default AddProduct;