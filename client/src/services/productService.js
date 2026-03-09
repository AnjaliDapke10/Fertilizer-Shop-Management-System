import api from "./api";

export const getProducts = async () => {
  const res = await api.get("/products");
   return Array.isArray(res.data) ? res.data : res.data.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};