import api from "./api";

export const getProducts = async () => {

  const res = await api.get("/products");

  return Array.isArray(res.data) ? res.data : res.data.data;

};

export const createProduct = async (data) => {

  const res = await api.post("/products", data);

  return res.data;

};

export const deleteProduct = async (id) => {

  const res = await api.delete(`/products/${id}`);

  return res.data;

};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const getProductBatches = async (productId) => {

  const res = await api.get(`/batches/product/${productId}`);

  return res.data;

};