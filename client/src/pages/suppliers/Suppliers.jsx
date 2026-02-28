import { useEffect, useState } from "react";
import { getSuppliers } from "../../services/supplierService";

import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";

import AddSupplier from "./AddSuppliers";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchSuppliers = () => {
    setLoading(true);
    getSuppliers()
      .then(setSuppliers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageWrapper
        title="Suppliers"
        subtitle="Manage your supplier information"
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add Supplier
          </button>
        }
      >
        <Card>
          <Table
            columns={["Name", "Phone", "GSTIN"]}
            data={suppliers.map((s) => ({
              name: s.name,
              phone: s.phone,
              gstin: s.gstin || "-",
            }))}
          />
        </Card>
      </PageWrapper>

      {showAdd && (
        <AddSupplier
          onClose={() => setShowAdd(false)}
          onSave={() => {
            setShowAdd(false);
            fetchSuppliers(); // ✅ refresh list after DB insert
          }}
        />
      )}
    </>
  );
};

export default Suppliers;
