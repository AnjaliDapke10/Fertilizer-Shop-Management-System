import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 14px",
  borderRadius: "8px",
  color: isActive ? "#166534" : "#374151",
  background: isActive ? "#dcfce7" : "transparent",
  textDecoration: "none",
  fontWeight: 500,
});

const SideBar = () => {
  return (
    <aside
      style={{
        width: "240px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "24px", fontWeight: 600 }}>
         FertilizerShop
      </h2>

      <nav style={{
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",}}>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/products" style={linkStyle}>Products</NavLink>
        <NavLink to="/suppliers" style={linkStyle}>Suppliers</NavLink>
        <NavLink to="/customers" style={linkStyle}>Customers</NavLink>
        <NavLink to="/inventory" style={linkStyle}>Inventory</NavLink>
        <NavLink to="/sales" style={linkStyle}>Sales</NavLink>
        <NavLink to="/purchases" style={linkStyle}>Purchases</NavLink>
        <NavLink to="/reports" style={linkStyle}>Reports</NavLink>
      </nav>
    </aside>
  );
};

export default SideBar;
