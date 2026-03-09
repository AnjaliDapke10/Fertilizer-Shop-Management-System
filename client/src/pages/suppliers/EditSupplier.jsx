import { useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { updateSupplier } from "../../services/supplierService";

const EditSupplier = ({ supplier, onClose, onSave }) => {

  const [formData, setFormData] = useState({ ...supplier });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async () => {

    await updateSupplier(supplier.id, formData);

    onSave();

  };

  return (

    <Modal title="Edit Supplier" onClose={onClose}>

      <div style={{ display: "grid", gap: "16px" }}>

        <Input label="Supplier Name" name="name" value={formData.name} onChange={handleChange} />

        <Input label="Contact Person" name="contact_person" value={formData.contact_person || ""} onChange={handleChange} />

        <Input label="Phone" name="phone" value={formData.phone || ""} onChange={handleChange} />

        <Input label="Email" name="email" value={formData.email || ""} onChange={handleChange} />

        <Input label="GSTIN" name="gstin" value={formData.gstin || ""} onChange={handleChange} />

        <Input label="Address" name="address" value={formData.address || ""} onChange={handleChange} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>

          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleSubmit}>
            Update
          </button>

        </div>

      </div>

    </Modal>
  );

};

export default EditSupplier;