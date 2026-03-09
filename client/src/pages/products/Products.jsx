import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/productService";

import Loader from "../../components/common/Loader";
import AddProduct from "./AddProduct";
import ProductBatches from "./ProductBatches"; 

const Products = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortField, setSortField] = useState("nearest_expiry");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Load products from API
  const loadProducts = async () => {

    setLoading(true);

    try {

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("Failed to load products", err);
      setProducts([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      await deleteProduct(id);

      loadProducts();

    } catch (err) {

      console.error("Delete failed", err);

    }

  };

  // Search filter
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort by nearest expiry
  const sortedProducts = [...filteredProducts].sort((a, b) => {

  let valueA = a[sortField];
  let valueB = b[sortField];

  if (sortField === "nearest_expiry") {
    valueA = valueA ? new Date(valueA) : new Date(9999,0,1);
    valueB = valueB ? new Date(valueB) : new Date(9999,0,1);
  }

  if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
  if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;

  return 0;

});

const handleSort = (field) => {

  if (sortField === field) {

    setSortDirection(sortDirection === "asc" ? "desc" : "asc");

  } else {

    setSortField(field);
    setSortDirection("asc");

  }

};

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

<th onClick={() => handleSort("name")}>
  Product {sortField === "name" && (sortDirection === "asc" ? "▲" : "▼")}
</th>

<th>NPK</th>

<th>Unit</th>

<th onClick={() => handleSort("stock")}>
  Stock {sortField === "stock" && (sortDirection === "asc" ? "▲" : "▼")}
</th>

<th>Status</th>

<th onClick={() => handleSort("nearest_expiry")}>
  Expiry {sortField === "nearest_expiry" && (sortDirection === "asc" ? "▲" : "▼")}
</th>

<th>Actions</th>

</tr>
</thead>

          <tbody>

            {sortedProducts.length === 0 ? (

              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>

            ) : (

              sortedProducts.map(product => {

                let status = "Good";

                if (product.stock === 0) status = "Out";
                else if (product.stock <= product.reorder_level) status = "Low";

                return (

                  <tr
  key={product.id}
  onClick={() => setSelectedProduct(product)}
  style={{ cursor: "pointer" }}
>

                    <td>{product.name}</td>

                    <td>{product.npk_ratio || "-"}</td>

                    <td>{product.unit}</td>

                    <td>{product.stock}</td>

                    <td>

                      {status === "Good" && (
                        <span className="badge good">Good</span>
                      )}

                      {status === "Low" && (
                        <span className="badge low">Low Stock</span>
                      )}

                      {status === "Out" && (
                        <span className="badge danger">Out</span>
                      )}

                    </td>

                    <td>

                      {product.nearest_expiry
                        ? new Date(product.nearest_expiry).toLocaleDateString()
                        : "-"}

                    </td>

                    <td>

                      <div className="actions">

                        <button
                          className="btn-icon edit"
                          onClick={() => setEditingProduct(product)}
                          >
                          ✏
                        </button>

                        <button
                          className="btn-icon delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>

                );

              })

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

      {editingProduct && (
        <AddProduct
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={() => {
          setEditingProduct(null);
          loadProducts();
          }}
      />
      )}

      {selectedProduct && (

  <ProductBatches
    product={selectedProduct}
    onClose={() => setSelectedProduct(null)}
  />

)}

    </div>
  );

};

export default Products;