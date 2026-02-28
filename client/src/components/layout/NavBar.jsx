const NavBar = () => {
  return (
    <header
      style={{
        height: "56px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: 500 }}>
        Fertilizer Shop Management System
      </h3>
      <strong>Admin</strong>
    </header>
  );
};

export default NavBar;
