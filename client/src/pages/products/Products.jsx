import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="card">
        <h2>Products</h2>

        <Table
          columns={["Name", "NPK", "Unit"]}
          data={products.map(p => ({
            name: p.name,
            npk: p.npk_ratio,
            unit: p.unit,
          }))}
        />
      </div>
    </div>
  );
};

export default Products;
