const Card = ({ children }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "22px",
        border: "1px solid #e5e7eb",
      }}
    >
      {children}
    </div>
  );
};

export default Card;
