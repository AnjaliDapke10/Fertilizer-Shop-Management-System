const ProductSelect = ({ products, value, onChange }) => {

  return (

    <select value={value} onChange={onChange}>

      <option value="">Select Product</option>

      {products.map((p) => (
        <option key={p.product_id} value={p.product_id}>
          {p.product_name} (Stock: {p.available_qty})
        </option>
      ))}

    </select>

  );

};

export default ProductSelect;