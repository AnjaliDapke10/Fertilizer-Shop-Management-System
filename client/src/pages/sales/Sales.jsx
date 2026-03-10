import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import PaymentModal from "./Payments";
import { getSales } from "../../services/salesService";
import NewSale from "./NewSale";
import InvoiceView from "./InvoiceView";
import { formatSaleStatus, formatPaymentMethod } from "../../utils/salesUtils";
import { getSaleById } from "../../services/salesService";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await getSales();
      setSales(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageWrapper
        title="Sales / Billing"
        subtitle="Create new sales and manage billing"
        action={
          <button className="btn-primary" onClick={() => setShowNew(true)}>
            + New Sale
          </button>
        }
      >
        <Card>
          <Table
            columns={[
              "Invoice No",
              "Customer",
              "Items",
              "Total",
              "Date",
              "Payment",
              "Status",
            ]}
            data={sales.map((s) => ({
              invoice_number: s.invoice_number,
              customer_name: s.customer_name || "Walk-in",
              items: s.item_count || "-",
              total_amount: `₹${s.total_amount}`,
              sale_date: new Date(s.sale_date).toLocaleDateString(),
              payment_method: formatPaymentMethod(s.payment_method),
              status: formatSaleStatus(s.status),
            }))}
            actions={(row) => {
  const sale = sales.find(
    (s) => s.invoice_number === row.invoice_number
  );

  return (
    <div style={{ display: "flex", gap: "8px" }}>

      {/* VIEW INVOICE */}
      <button
        className="icon-btn.edit"
        title="View Invoice"
        onClick={() => {
          setSelectedSale(sale.id);
          setShowInvoice(true);
        }}
      >
        👁
      </button>

      {/* ADD PAYMENT */}
      <button
        className="icon-btn"
        title="Add Payment"
        onClick={async () => {

  const data = await getSaleById(sale.id);

  setSelectedSale({
    ...data.sale,
    payments: data.payments
  });

  setShowPayment(true);

}}
      >
        💰
      </button>

    </div>
  );
}}
          />
        </Card>
      </PageWrapper>

      {showNew && (
        <NewSale
          onClose={() => setShowNew(false)}
          onSave={() => {
            setShowNew(false);
            fetchSales();
          }}
        />
      )}

      {showInvoice && selectedSale && (
        <InvoiceView
          saleId={selectedSale}
          onClose={() => {
            setShowInvoice(false);
            setSelectedSale(null);
          }}
        />
      )}

      {showPayment && selectedSale && (
  <PaymentModal
    sale={selectedSale}
    payments={selectedSale.payments || []}
    onClose={() => setShowPayment(false)}
    onSuccess={() => {
      setShowPayment(false);
      fetchSales();
    }}
  />
)}
    </>
  );
};

export default Sales;