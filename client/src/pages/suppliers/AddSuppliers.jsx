import { useState } from "react";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import { createSupplier } from "../../services/supplierService";

const AddSupplier = ({ onClose, onSave }) => {
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
    await createSupplier(formData); // ✅ actual API call
    onSave(); // tell parent to refetch
  };

  return (
    <Modal title="Add New Supplier" onClose={onClose}>
      <div style={{ display: "grid", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Supplier Name" name="name" onChange={handleChange} />
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
            Add Supplier
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddSupplier;
