import { useEffect, useState } from "react";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { getSalesReport } from "../../services/reportService";

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalesReport()
      .then(setSales)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <Card title="Sales Report">
      <Table
        columns={["Invoice", "Date", "Customer", "Total"]}
        data={sales.map(s => ({
          invoice: s.invoice_number,
          date: s.sale_date,
          customer: s.customer_name,
          total: `₹${s.total_amount}`
        }))}
      />
    </Card>
  );
};

export default Reports;
