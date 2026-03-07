import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import Loader from "../../components/common/Loader";
import AddProduct from "../../pages/products/AddProduct";

const Products = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // Load products from API
  const loadProducts = () => {
    setLoading(true);

    getProducts()
      .then(res => {
        setProducts(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Search filter
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <h2>Products</h2>
          <p>Manage your fertilizer inventory</p>
        </div>

        <button
          className="btn-add"
          onClick={() => setShowAdd(true)}
        >
          + Add Product
        </button>

      </div>

      {/* SEARCH BAR */}

      <div className="search-bar">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* PRODUCTS TABLE */}

      <div className="card">

        <table className="table">

          <thead>

            <tr>
              <th>Product Name</th>
              <th>NPK</th>
              <th>Unit</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Nearest Expiry</th>
            </tr>

          </thead>

          <tbody>

            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            ) : (

              filteredProducts.map(product => (

                <tr key={product.id}>

                  <td>{product.name}</td>

                  <td>{product.npk_ratio || "-"}</td>

                  <td>{product.unit}</td>

                  <td>{product.stock}</td>

                  <td>

                    {product.stock <= product.reorder_level ? (

                      <span className="badge low">
                        Low Stock
                      </span>

                    ) : (

                      <span className="badge good">
                        Good
                      </span>

                    )}

                  </td>

                  <td>

                    {product.nearest_expiry
                      ? new Date(product.nearest_expiry)
                          .toLocaleDateString()
                      : "-"}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ADD PRODUCT MODAL */}

      {showAdd && (

        <AddProduct
          onClose={() => setShowAdd(false)}
          onSuccess={loadProducts}
        />

      )}

    </div>
  );
};

export default Products;