import { useState, useEffect } from "react";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import { createCustomer, updateCustomer } from "../../services/customerService";

const AddCustomer = ({ customer, onClose, onSave }) => {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    address: "",
  });

  /* Populate form when editing */
  useEffect(() => {

    if (customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        gstin: customer.gstin || "",
        address: customer.address || "",
      });
    }

  }, [customer]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async () => {

    if (!formData.name || !formData.phone) {
      alert("Name and phone are required");
      return;
    }

    if (customer) {
      await updateCustomer(customer.id, formData);
    } else {
      await createCustomer(formData);
    }

    onSave();
  };

  return (
    <Modal
      title={customer ? "Edit Customer" : "Add New Customer"}
      onClose={onClose}
    >

      <div style={{ display: "grid", gap: "16px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          <Input
            label="Customer Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          <Input
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="GSTIN"
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
          />

        </div>

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>

          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleSubmit}>
            {customer ? "Update Customer" : "Add Customer"}
          </button>

        </div>

      </div>

    </Modal>
  );
};

export default AddCustomer;