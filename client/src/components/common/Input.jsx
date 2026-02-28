const Input = ({ label, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "14px", color: "#374151" }}>{label}</label>
      <input
        {...props}
        style={{
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          outline: "none",
        }}
      />
    </div>
  );
};

export default Input;
