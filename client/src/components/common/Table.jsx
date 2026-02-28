const Table = ({ columns, data, actions }) => {
  return (
    <table width="100%" cellPadding="10">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col} align="left">{col}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((val, idx) => (
              <td key={idx}>{val}</td>
            ))}
            {actions && <td>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
