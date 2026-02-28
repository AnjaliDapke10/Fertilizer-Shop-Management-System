const AlertsPanel = ({ alerts }) => {
  return (
    <div className="card">
      <h3>Alerts</h3>
      {alerts.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No alerts</p>
      ) : (
        <ul>
          {alerts.map((a, i) => (
            <li key={i} style={{ color: "#b91c1c", marginBottom: "6px" }}>
              {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertsPanel;
