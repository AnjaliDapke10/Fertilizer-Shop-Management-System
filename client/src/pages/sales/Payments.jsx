import { useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { createPayment } from "../../services/paymentService";

const PaymentModal = ({ sale, payments = [], onClose, onSuccess }) => {

  const totalAmount = Number(sale.total_amount);

  const paidAmount = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const remainingAmount = totalAmount - paidAmount;

  const [amount, setAmount] = useState(remainingAmount);

  const submit = async () => {

    if (!amount || amount <= 0) {
      alert("Enter valid payment amount");
      return;
    }

    if (amount > remainingAmount) {
      alert("Amount cannot exceed remaining balance");
      return;
    }

    await createPayment({
      customer_id: sale.customer_id,
      sale_id: sale.id,
      amount: Number(amount),
      payment_date: new Date().toISOString().slice(0, 10),
      method: "cash"
    });

    onSuccess();
  };

  return (
    <Modal title="Record Payment" onClose={onClose}>

      <div style={{ display: "grid", gap: "18px" }}>

        {/* PAYMENT SUMMARY */}

        <div className="card">

          <div className="bill-row">
            <span>Total Invoice</span>
            <b>₹{totalAmount}</b>
          </div>

          <div className="bill-row">
            <span>Already Paid</span>
            <span>₹{paidAmount}</span>
          </div>

          <div className="bill-row">
            <span>Remaining</span>
            <b style={{ color: "#dc2626" }}>₹{remainingAmount}</b>
          </div>

        </div>

        {/* PAYMENT INPUT */}

        <Input
          label="Payment Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* ACTION BUTTONS */}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>

          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={submit}>
            Save Payment
          </button>

        </div>

      </div>

    </Modal>
  );
};

export default PaymentModal;