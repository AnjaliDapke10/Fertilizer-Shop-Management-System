import { useEffect, useState } from "react";
import { getProductBatches } from "../../services/productService";

const ProductBatches = ({ product, onClose }) => {

  const [batches, setBatches] = useState([]);

  useEffect(() => {

    getProductBatches(product.id)
      .then(setBatches)
      .catch(err => console.error(err));

  }, [product]);

  return (

    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h3>{product.name} Batches</h3>

          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>

        </div>

        <div className="modal-body">

          <table className="table">

            <thead>

              <tr>
                <th>Batch</th>
                <th>Available Qty</th>
                <th>Expiry</th>
                <th>Purchase Price</th>
              </tr>

            </thead>

            <tbody>

              {batches.length === 0 ? (

                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No batches available
                  </td>
                </tr>

              ) : (

                batches.map(batch => (

                  <tr key={batch.id}>

                    <td>{batch.batch_number}</td>

                    <td>{batch.available_qty}</td>

                    <td>
                      {batch.expiry_date
                        ? new Date(batch.expiry_date).toLocaleDateString()
                        : "-"
                      }
                    </td>

                    <td>₹{batch.purchase_price}</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};

export default ProductBatches;