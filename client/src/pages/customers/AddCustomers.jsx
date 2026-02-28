import { useState } from "react";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import { createCustomer } from "../../services/customerService";

const AddCustomer = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createCustomer(formData);
    onSave(); // tells parent to refresh
  };

  return (
    <Modal title="Add New Customer" onClose={onClose}>
      <div style={{ display: "grid", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Customer Name" name="name" onChange={handleChange} />
          <Input label="Phone Number" name="phone" onChange={handleChange} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Email Address" name="email" onChange={handleChange} />
          <Input label="GSTIN" name="gstin" onChange={handleChange} />
        </div>

        <Input label="Address" name="address" onChange={handleChange} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Add Customer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCustomer;
