import api from "./api";

export const createPayment = async (data) => {
  const res = await api.post("/payments", data);
  return res.data;
};
