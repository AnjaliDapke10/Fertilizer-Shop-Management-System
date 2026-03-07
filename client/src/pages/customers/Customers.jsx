import { useEffect, useState } from "react";
import {
  getCustomers,
  deleteCustomer,
} from "../../services/customerService";

import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";

import AddCustomer from "./AddCustomers";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const fetchCustomers = () => {
    setLoading(true);

    getCustomers()
      .then((data) => setCustomers(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    await deleteCustomer(id);
    fetchCustomers();
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageWrapper
        title="Customers"
        subtitle="Manage your customers and credit"
        action={
          <button
            className="btn-primary"
            onClick={() => {
              setEditingCustomer(null);
              setShowAdd(true);
            }}
          >
            + Add Customer
          </button>
        }
      >
        <Card>
          <Table
            columns={[
              "Name",
              "Phone",
              "Email",
              "Address",
              "GSTIN",
              "Credit Balance",
              "Actions",
            ]}
            data={customers.map((c) => ({
              name: c.name,
              phone: c.phone || "-",
              email: c.email || "-",
              address: c.address || "-",
              gstin: c.gstin || "-",
              credit_balance: `₹${c.credit_balance || 0}`,

              actions: (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditingCustomer(c);
                      setShowAdd(true);
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(c.id)}
                  >
                    ❌
                  </button>
                </div>
              ),
            }))}
          />
        </Card>
      </PageWrapper>

      {showAdd && (
        <AddCustomer
          customer={editingCustomer}
          onClose={() => setShowAdd(false)}
          onSave={() => {
            setShowAdd(false);
            fetchCustomers();
          }}
        />
      )}
    </>
  );
};

export default Customers;