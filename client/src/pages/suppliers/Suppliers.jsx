import { useEffect, useState } from "react";
import { getSuppliers, deleteSupplier } from "../../services/supplierService";

import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";

import AddSupplier from "./AddSuppliers";
import EditSupplier from "./EditSupplier";

import { useNavigate } from "react-router-dom";

const Suppliers = () => {

  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchSuppliers = () => {

    setLoading(true);

    getSuppliers()
      .then((data) => {
        setSuppliers(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));

  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {

    const keyword = search.toLowerCase();

    const filteredData = suppliers.filter((s) =>
      s.name?.toLowerCase().includes(keyword) ||
      s.phone?.toLowerCase().includes(keyword) ||
      s.gstin?.toLowerCase().includes(keyword)
    );

    setFiltered(filteredData);

  }, [search, suppliers]);

  const handleDelete = async (id) => {

    const confirm = window.confirm("Delete this supplier?");

    if (!confirm) return;

    await deleteSupplier(id);

    fetchSuppliers();

  };

  if (loading) return <Loader />;

  return (
    <>
      <PageWrapper
        title="Suppliers"
        subtitle="Manage supplier information"
        action={
          <button
            className="btn-primary"
            onClick={() => setShowAdd(true)}
          >
            + Add Supplier
          </button>
        }
      >

        <Card>

          {/* SEARCH BAR */}

          <div style={{ marginBottom: "16px" }}>
            <input
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px",
                width: "320px",
                border: "1px solid #ccc",
                borderRadius: "6px"
              }}
            />
          </div>

          <Table
            columns={[
              "Name",
              "Contact Person",
              "Phone",
              "Email",
              "GSTIN",
              "Address",
              "Actions"
            ]}
            data={filtered.map((s) => ({

              name: s.name,
              contact_person: s.contact_person || "-",
              phone: s.phone || "-",
              email: s.email || "-",
              gstin: s.gstin || "-",
              address: s.address || "-",

              actions: (
                <div style={{ display: "flex", gap: "8px" }}>

                  {/* EDIT */}

                  <button
                    className="btn-secondary"
                    onClick={() => setEditSupplier(s)}
                  >
                    ✏️
                  </button>

                  {/* DELETE */}

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(s.id)}
                  >
                    🗑
                  </button>

                  {/* PURCHASES */}

                  <button
                    className="btn-primary"
                    onClick={() =>
                      navigate(`/purchases?supplier=${s.id}`)
                    }
                  >
                    📦
                  </button>

                </div>
              )

            }))}
          />

        </Card>

      </PageWrapper>

      {/* ADD SUPPLIER MODAL */}

      {showAdd && (
        <AddSupplier
          onClose={() => setShowAdd(false)}
          onSave={() => {
            setShowAdd(false);
            fetchSuppliers();
          }}
        />
      )}

      {/* EDIT SUPPLIER MODAL */}

      {editSupplier && (
        <EditSupplier
          supplier={editSupplier}
          onClose={() => setEditSupplier(null)}
          onSave={() => {
            setEditSupplier(null);
            fetchSuppliers();
          }}
        />
      )}

    </>
  );
};

export default Suppliers;