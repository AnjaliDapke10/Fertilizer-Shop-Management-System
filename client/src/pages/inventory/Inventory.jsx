import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getInventorySummary } from "../../services/inventoryService";

import {
  getLowStock,
  getNearExpiry
} from "../../services/inventoryService";

import { getProducts } from "../../services/productService";

const Inventory = () => {

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [nearExpiry, setNearExpiry] = useState([]);

  const fetchInventory = async () => {

    setLoading(true);

    try {

      const [productData, lowStockData, expiryData] =
        await Promise.all([
          getInventorySummary(),
          getLowStock(),
          getNearExpiry()
        ]);

      setProducts(productData || []);
      setLowStock(lowStockData || []);
      setNearExpiry(expiryData || []);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) return <Loader />;

  /* SUMMARY */

  const totalProducts = products.length;

  const totalUnits = products.reduce((sum, p) => {
  const qty = parseInt(p.available_qty, 10) || 0;
  return sum + qty;
}, 0);

  const lowStockCount = lowStock.length;
  const expiryCount = nearExpiry.length;

  /* STATUS CHECK */

  const getStatus = (qty, reorder) => {

    if (qty <= reorder) {
      return <span className="badge low">Low</span>;
    }

    return <span className="badge good">Healthy</span>;
  };

  return (

    <PageWrapper
      title="Inventory"
      subtitle="Track stock levels and expiry"
    >

      {/* SUMMARY CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "20px"
        }}
      >

        <Card>
          <h4>Total Products</h4>
          <h2>{totalProducts}</h2>
        </Card>

        <Card>
          <h4>Total Units</h4>
          <h2>{totalUnits}</h2>
        </Card>

        <Card>
          <h4>Low Stock</h4>
          <h2>{lowStockCount}</h2>
        </Card>

        <Card>
          <h4>Near Expiry</h4>
          <h2>{expiryCount}</h2>
        </Card>

      </div>

      {/* PRODUCT INVENTORY */}

      <Card>

        <h3>Product Inventory</h3>

        <table className="table">

          <thead>
            <tr>
              <th>Product</th>
              <th>Available Qty</th>
              <th>Reorder Level</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {products.length === 0 && (
              <tr>
                <td colSpan="4">No products found</td>
              </tr>
            )}

            {products.map((p) => (

              <tr key={p.id}>

                <td>{p.name}</td>

                <td>
                  {p.available_qty ?? 0}
                </td>

                <td>
                  {p.reorder_level}
                </td>

                <td>
                  {getStatus(
                    p.available_qty ?? 0,
                    p.reorder_level
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </Card>

      {/* LOW STOCK */}

      <Card>

        <h3>Low Stock Alerts</h3>

        <table className="table">

          <thead>
            <tr>
              <th>Product</th>
              <th>Available Qty</th>
              <th>Reorder Level</th>
            </tr>
          </thead>

          <tbody>

            {lowStock.length === 0 && (
              <tr>
                <td colSpan="3">No low stock items</td>
              </tr>
            )}

            {lowStock.map((p) => (

              <tr key={p.id}>

                <td>{p.name}</td>

                <td>{p.total_stock}</td>

                <td>{p.reorder_level}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </Card>

      {/* NEAR EXPIRY */}

      <Card>

        <h3>Near Expiry Batches</h3>

        <table className="table">

          <thead>
            <tr>
              <th>Product</th>
              <th>Batch</th>
              <th>Expiry Date</th>
              <th>Qty</th>
            </tr>
          </thead>

          <tbody>

            {nearExpiry.length === 0 && (
              <tr>
                <td colSpan="4">No expiring batches</td>
              </tr>
            )}

            {nearExpiry.map((b) => (

              <tr key={b.batch_id}>

                <td>{b.product_name}</td>

                <td>{b.batch_id}</td>

                <td>
                  {new Date(
                    b.expiry_date
                  ).toLocaleDateString()}
                </td>

                <td>{b.available_qty}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </Card>

    </PageWrapper>
  );
};

export default Inventory;