import { useEffect, useState } from "react";
import { getPurchases } from "../../services/purchaseService";

import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";

import AddPurchase from "./AddPurchase";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchPurchases = () => {
    setLoading(true);
    getPurchases()
      .then(setPurchases)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageWrapper
        title="Purchases"
        subtitle="Manage your purchase orders and inventory restocking"
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add Purchase
          </button>
        }
      >
        <Card>
          <Table
            columns={[
              "Invoice No",
              "Supplier",
              "Product",
              "Quantity",
              "Price/Unit",
              "Total Cost",
              "Date",
            ]}
            data={purchases.map((p) => ({
              invoice: p.invoice_number,
              supplier: p.supplier_name,
              product: p.product_name,
              quantity: p.quantity,
              price: `₹${p.purchase_price}`,
              total: `₹${p.total_cost}`,
              date: p.purchase_date,
            }))}
          />
        </Card>
      </PageWrapper>

      {showAdd && (
        <AddPurchase
          onClose={() => setShowAdd(false)}
          onSave={() => {
            setShowAdd(false);
            fetchPurchases();
          }}
        />
      )}
    </>
  );
};

export default Purchases;
