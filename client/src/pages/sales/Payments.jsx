import { useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { createPayment } from "../../services/paymentService";

const PaymentModal = ({ sale, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");

  const submit = async () => {
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
      <div style={{ display: "grid", gap: "16px" }}>
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

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
