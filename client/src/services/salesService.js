import api from "./api";

export const getSales = async () => {
  const res = await api.get("/sales");
  return res.data;
};

export const createSale = async (data) => {
  const res = await api.post("/sales", data);
  return res.data;
};

export const getSaleById = async (id) => {
  const res = await api.get(`/sales/${id}`);
  return res.data;
};

