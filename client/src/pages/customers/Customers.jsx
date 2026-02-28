import { useEffect, useState } from "react";
import { getCustomers } from "../../services/customerService";

import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";

import AddCustomer from "./AddCustomers";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    getCustomers()
      .then(setCustomers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageWrapper
        title="Customers"
        subtitle="Manage your customers and credit"
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add Customer
          </button>
        }
      >
        <Card>
          <Table
            columns={["Name", "Phone", "GSTIN", "Credit Balance"]}
            data={customers.map((c) => ({
              name: c.name,
              phone: c.phone,
              gstin: c.gstin || "-",
              credit_balance: `₹${c.credit_balance || 0}`,
            }))}
          />
        </Card>
      </PageWrapper>

      {showAdd && (
        <AddCustomer
          onClose={() => setShowAdd(false)}
          onSave={() => {
            setShowAdd(false);
            fetchCustomers(); // 🔥 refresh after insert
          }}
        />
      )}
    </>
  );
};

export default Customers;
