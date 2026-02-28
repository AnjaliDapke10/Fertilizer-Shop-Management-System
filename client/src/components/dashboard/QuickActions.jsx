import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h3>Quick Actions</h3>
      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
        <button onClick={() => navigate("/sales/new")}>New Sale</button>
        <button onClick={() => navigate("/purchases/add")}>New Purchase</button>
      </div>
    </div>
  );
};

export default QuickActions;
