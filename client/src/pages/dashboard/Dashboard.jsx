import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/common/Card";

const KPI = ({ label, value, sub }) => (
  <Card>
    <p style={{ color: "#6b7280", fontSize: "14px" }}>{label}</p>
    <h2 style={{ fontSize: "28px", margin: "8px 0" }}>{value}</h2>
    <p style={{ color: "#16a34a", fontSize: "13px" }}>{sub}</p>
  </Card>
);

const Dashboard = () => {
  return (
    <PageWrapper
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening in your shop today."
    >
      {/* KPI GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <KPI label="Today's Sales" value="₹2,840" sub="+12.5% from yesterday" />
        <KPI label="Products in Stock" value="156" sub="Across 24 categories" />
        <KPI label="Low Stock Alerts" value="3" sub="Needs reorder" />
        <KPI label="Near Expiry" value="2" sub="Expiring soon" />
      </div>

      {/* Charts later */}
    </PageWrapper>
  );
};

export default Dashboard;
