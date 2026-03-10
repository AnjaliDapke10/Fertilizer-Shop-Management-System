import api from "./api";

export const getLowStock = async () => {
  const res = await api.get("/inventory/low-stock");
  return res.data;
};

export const getNearExpiry = async () => {
  const res = await api.get("/inventory/near-expiry");
  return res.data;
};

export const getStockAging = async () => {
  const res = await api.get("/inventory/aging");
  return res.data;
};

export const getAvailableProducts = async () => {
  const res = await api.get("/inventory/available-products");
  return res.data;
};

export const getInventorySummary = async () => {
  const res = await api.get("/inventory/summary");
  return res.data;
};