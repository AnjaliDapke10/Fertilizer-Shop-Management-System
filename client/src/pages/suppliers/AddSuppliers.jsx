import { useState } from "react";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import { createSupplier } from "../../services/supplierService";

const AddSupplier = ({ onClose, onSave }) => {

  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    gstin: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    await createSupplier(formData);
    onSave();
  };

  return (
    <Modal title="Add New Supplier" onClose={onClose}>

      <div style={{ display: "grid", gap: "16px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Supplier Name" name="name" onChange={handleChange} />
          <Input label="Phone Number" name="phone" onChange={handleChange} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="Contact Person" name="contact_person" onChange={handleChange} />
          <Input label="Email Address" name="email" onChange={handleChange} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Input label="GSTIN" name="gstin" onChange={handleChange} />
          <Input label="Address" name="address" onChange={handleChange} />
        </div>

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