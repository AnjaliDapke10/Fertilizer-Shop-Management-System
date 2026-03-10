import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import { getSales } from "../../services/salesService";

const Reports = () => {

  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);

  const [filters, setFilters] = useState({
    start: "",
    end: ""
  });

  const fetchSales = async () => {
    setLoading(true);

    try {

      const data = await getSales();

      setSales(data || []);
      setFilteredSales(data || []);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  /* APPLY DATE FILTER */

  const applyFilter = () => {

    let result = [...sales];

    if (filters.start) {
      result = result.filter(
        (s) => new Date(s.sale_date) >= new Date(filters.start)
      );
    }

    if (filters.end) {
      result = result.filter(
        (s) => new Date(s.sale_date) <= new Date(filters.end)
      );
    }

    setFilteredSales(result);
  };

  /* CLEAR FILTER */

  const resetFilter = () => {
    setFilters({ start: "", end: "" });
    setFilteredSales(sales);
  };

  /* SUMMARY */

  const totalRevenue = filteredSales.reduce(
    (sum, s) => sum + Number(s.total_amount),
    0
  );

  const totalInvoices = filteredSales.length;

  if (loading) return <Loader />;

  return (
    <PageWrapper
      title="Reports"
      subtitle="Sales and business insights"
    >

      {/* FILTERS */}

      <Card>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "15px"
          }}
        >

          <input
            type="date"
            value={filters.start}
            onChange={(e) =>
              setFilters({ ...filters, start: e.target.value })
            }
          />

          <input
            type="date"
            value={filters.end}
            onChange={(e) =>
              setFilters({ ...filters, end: e.target.value })
            }
          />

          <button
            className="btn-primary"
            onClick={applyFilter}
          >
            Apply
          </button>

          <button
            className="btn-secondary"
            onClick={resetFilter}
          >
            Reset
          </button>

        </div>

        {/* SUMMARY */}

        <div
          style={{
            display: "flex",
            gap: "30px",
            marginBottom: "20px"
          }}
        >

          <div>
            <b>Total Revenue</b>
            <div>₹{totalRevenue}</div>
          </div>

          <div>
            <b>Total Invoices</b>
            <div>{totalInvoices}</div>
          </div>

        </div>

        {/* TABLE */}

        <table className="table">

          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {filteredSales.length === 0 && (
              <tr>
                <td colSpan="6">No records found</td>
              </tr>
            )}

            {filteredSales.map((s) => (

              <tr key={s.id}>

                <td>{s.invoice_number}</td>

                <td>
                  {new Date(s.sale_date).toLocaleDateString()}
                </td>

                <td>
                  {s.customer_name || "Walk-in"}
                </td>

                <td>
                  {s.item_count ? `${s.item_count}` : "-"}
                </td>

                <td>
                  ₹{s.total_amount}
                </td>

                <td>
                  {s.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </Card>

    </PageWrapper>
  );
};

export default Reports;