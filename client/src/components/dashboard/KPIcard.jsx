const KPIcard = ({ title, value, subtitle, icon, color = "#16a34a" }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "20px 22px",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "110px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>{title}</p>
        <span style={{ color }}>{icon}</span>
      </div>

      {/* Value */}
      <div>
        <h2
          style={{
            fontSize: "26px",
            fontWeight: "600",
            margin: "6px 0",
          }}
        >
          {value}
        </h2>
        {subtitle && (
          <p style={{ fontSize: "13px", color }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default KPIcard;
