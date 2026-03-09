import { useState } from "react";
import { createProduct } from "../../services/productService";

const AddProduct = ({ onClose, onSuccess }) => {

  const [form, setForm] = useState({
    name: "",
    npk_ratio: "",
    unit: "kg",
    gst_rate: "",
    reorder_level: ""
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

      <div className="modal modal-md">

        <div className="modal-header">
          <h3>Add New Product</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">

          <div className="form-grid">

            <div className="form-group">
              <label>Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>NPK Ratio</label>
              <input
                name="npk_ratio"
                placeholder="Example: 10-26-26"
                value={form.npk_ratio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
              >
                <option value="kg">Kg</option>
                <option value="bag">Bag</option>
                <option value="litre">Litre</option>
              </select>
            </div>

            <div className="form-group">
              <label>GST Rate (%)</label>
              <input
                type="number"
                name="gst_rate"
                value={form.gst_rate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Reorder Level</label>
              <input
                type="number"
                name="reorder_level"
                value={form.reorder_level}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>

            <button type="submit" className="btn-primary">
              Add Product
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddProduct;