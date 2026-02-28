const PageWrapper = ({ title, subtitle, action, children }) => {
  return (
    <div style={{ padding: "24px" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 600 }}>{title}</h1>
          {subtitle && (
            <p style={{ color: "#6b7280", marginTop: "4px" }}>
              {subtitle}
            </p>
          )}
        </div>

        {action}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
};

export default PageWrapper;
