const ProductSelect = ({ products, value, onChange }) => {
  return (
    <select value={value} onChange={onChange}>
      <option value="">Select</option>
      {products.map(p => (
        <option key={p.id} value={p.id}>
          {p.name} - ₹{p.price}/Kg
        </option>
      ))}
    </select>
  );
};

export default ProductSelect;
