const Button = ({ children, onClick, type = "primary" }) => {
  const colors = {
    primary: "#2e7d32",
    danger: "#d32f2f",
    secondary: "#555"
  };

  return (
    <button
      onClick={onClick}
      style={{
        background: colors[type],
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
};

export default Button;
