import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import { getSales } from "../../services/salesService";
import { getLowStock, getNearExpiry } from "../../services/inventoryService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const Dashboard = () => {

  const [loading, setLoading] = useState(true);

  const [sales, setSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [nearExpiry, setNearExpiry] = useState([]);

  const [salesChart, setSalesChart] = useState([]);

  const fetchData = async () => {

    try {

      setLoading(true);

      const salesData = await getSales();
      const lowStockData = await getLowStock();
      const expiryData = await getNearExpiry();

      setSales(salesData || []);
      setLowStock(lowStockData || []);
      setNearExpiry(expiryData || []);

      buildSalesChart(salesData || []);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  /* BUILD SALES TREND */

  const buildSalesChart = (salesData) => {

    const grouped = {};

    salesData.forEach((s) => {

      const date = new Date(s.sale_date).toLocaleDateString();

      if (!grouped[date]) grouped[date] = 0;

      grouped[date] += Number(s.total_amount);

    });

    const chartData = Object.keys(grouped).map((d) => ({
      date: d,
      sales: grouped[d]
    }));

    setSalesChart(chartData);

  };

  /* TODAY SALES */

  const today = new Date().toLocaleDateString();

  const todaySales = sales
    .filter((s) => new Date(s.sale_date).toLocaleDateString() === today)
    .reduce((sum, s) => sum + Number(s.total_amount), 0);

  if (loading) return <Loader />;

  return (

    <PageWrapper
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening in your shop today."
    >

      {/* KPI CARDS */}

      <div className="dashboard-grid">

        <Card className="dashboard-card">
          <div className="card-header">Today's Sales</div>
          <div className="card-value">₹{todaySales}</div>
          <div className="card-sub">Revenue generated today</div>
        </Card>

        <Card className="dashboard-card">
          <div className="card-header">Total Sales</div>
          <div className="card-value">{sales.length}</div>
          <div className="card-sub">All recorded invoices</div>
        </Card>

        <Card className="dashboard-card">
          <div className="card-header">Low Stock Alerts</div>
          <div className="card-value">{lowStock.length}</div>
          <div className="card-sub">Products needing reorder</div>
        </Card>

        <Card className="dashboard-card">
          <div className="card-header">Near Expiry</div>
          <div className="card-value">{nearExpiry.length}</div>
          <div className="card-sub">Batches expiring soon</div>
        </Card>

      </div>

      {/* SALES TREND */}

      <Card className="chart-card">

        <h3 style={{ marginBottom: "15px", fontWeight: 600 }}>
          Sales Trend
        </h3>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={salesChart}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2e7d32"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </Card>

      {/* LOWER SECTION */}

      <div className="dashboard-bottom">

        {/* LOW STOCK */}

        <Card className="table-card">

          <h3 style={{ marginBottom: "10px" }}>Low Stock Products</h3>

          <table className="table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Reorder Level</th>
              </tr>
            </thead>

            <tbody>

              {lowStock.length === 0 && (
                <tr>
                  <td colSpan="3">No low stock products</td>
                </tr>
              )}

              {lowStock.map((p) => (

                <tr key={p.id}>

                  <td>{p.name}</td>

                  <td>
                    <span className="badge danger">
                      {p.total_stock}
                    </span>
                  </td>

                  <td>{p.reorder_level}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </Card>

        {/* EXPIRY */}

        <Card className="table-card">

          <h3 style={{ marginBottom: "10px" }}>Expiring Soon</h3>

          <table className="table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Expiry Date</th>
                <th>Qty</th>
              </tr>
            </thead>

            <tbody>

              {nearExpiry.length === 0 && (
                <tr>
                  <td colSpan="3">No expiring batches</td>
                </tr>
              )}

              {nearExpiry.map((b) => (

                <tr key={b.batch_id}>

                  <td>{b.product_name}</td>

                  <td>
                    {new Date(b.expiry_date).toLocaleDateString()}
                  </td>

                  <td>{b.available_qty}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </Card>

      </div>

      {/* RECENT SALES */}

      <Card className="table-card" style={{ marginTop: "20px" }}>

        <h3 style={{ marginBottom: "10px" }}>Recent Sales</h3>

        <table className="table">

          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {sales.slice(0, 5).map((s) => (

              <tr key={s.id}>

                <td>{s.invoice_number}</td>

                <td>{s.customer_name || "Walk-in"}</td>

                <td>₹{s.total_amount}</td>

                <td>
                  {new Date(s.sale_date).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </Card>

    </PageWrapper>

  );

};

export default Dashboard;