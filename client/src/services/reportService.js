import api from "./api";

export const getSalesReport = async () => {
  const res = await api.get("/reports/sales");
  return res.data;
};

export const getProfitLoss = async () => {
  const res = await api.get("/reports/profit-loss");
  return res.data;
};
