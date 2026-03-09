import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Table from "../../components/common/Table";
import { getPurchaseDetails } from "../../services/purchaseService";

const PurchaseDetailModal = ({ purchaseId, onClose }) => {

  const [items, setItems] = useState([]);

  useEffect(() => {

    getPurchaseDetails(purchaseId).then(setItems);

  }, [purchaseId]);

  return (

    <Modal title="Purchase Details" onClose={onClose}>

      {items.length > 0 && (

        <>
          <p><strong>Invoice:</strong> {items[0].invoice_number}</p>
          <p><strong>Supplier:</strong> {items[0].supplier_name}</p>
          <p><strong>Date:</strong> {items[0].purchase_date}</p>

          <Table
            columns={[
              "Product",
              "Batch",
              "Expiry",
              "Qty",
              "Price"
            ]}
            data={items.map(i => ({
              product: i.product_name,
              batch: i.batch_number,
              expiry: i.expiry_date,
              qty: i.quantity,
              price: `₹${i.purchase_price}`
            }))}
          />
        </>

      )}

    </Modal>
  );
};

export default PurchaseDetailModal;