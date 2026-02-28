import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import { getSaleById } from "../../services/salesService";
import PaymentModal from "./Payments";
import {
  formatSaleStatus,
  formatPaymentMethod
} from "../../utils/salesUtils";

const InvoiceView = ({ saleId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    getSaleById(saleId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [saleId]);

  if (loading) return <Loader />;
  if (!data) return null;

  const { sale, items, payments } = data;

  return (
    <>
      <Modal title="Invoice Details" onClose={onClose}>
        <div className="invoice">

          {/* HEADER */}
          <div className="invoice-header">
            <div>
              <h3>Invoice #{sale.invoice_number}</h3>
              <p>Date: {new Date(sale.sale_date).toLocaleDateString()}</p>
            </div>
            <div>
              <span className={`badge ${sale.status}`}>
                {formatSaleStatus(sale.status)}
              </span>
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="invoice-section">
            <b>Customer</b>
            <p>{sale.customer_name || "Walk-in Customer"}</p>
            {sale.phone && <p>📞 {sale.phone}</p>}
          </div>

          {/* ITEMS */}
          <div className="invoice-section">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Batch</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.product_name}</td>
                    <td>{i.batch_number}</td>
                    <td>{i.quantity}</td>
                    <td>₹{i.price_per_unit}</td>
                    <td>₹{i.line_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAYMENTS */}
          <div className="invoice-section">
            <b>Payments</b>
            {payments.length === 0 && <p>No payments yet</p>}
            {payments.map((p, idx) => (
              <p key={idx}>
                ₹{p.amount} via {formatPaymentMethod(p.method)} on{" "}
                {new Date(p.payment_date).toLocaleDateString()}
              </p>
            ))}
          </div>

          {/* TOTAL */}
          <div className="invoice-total">
            <b>Grand Total: ₹{sale.total_amount}</b>
          </div>

          {/* ACTIONS */}
          <div className="invoice-actions">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>

            {sale.status !== "completed" && (
              <button
                className="btn-primary"
                onClick={() => setShowPayment(true)}
              >
                Add Payment
              </button>
            )}

            <button
              className="btn-secondary"
              onClick={() => window.print()}
            >
              Print Invoice
            </button>
          </div>
        </div>
      </Modal>

      {showPayment && (
        <PaymentModal
          sale={sale}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            onClose(); // refresh sales list
          }}
        />
      )}
    </>
  );
};

export default InvoiceView;
