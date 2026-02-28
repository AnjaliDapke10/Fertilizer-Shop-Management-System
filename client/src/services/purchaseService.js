import api from "./api";

export const getPurchases = async () => {
  const res = await api.get("/purchases");
  return res.data;
};

export const createPurchase = async (data) => {
  const res = await api.post("/purchases", data);
  return res.data;
};
