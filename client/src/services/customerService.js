import api from "./api";

export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const getOutstanding = async (id) => {
  const res = await api.get(`/customers/${id}/outstanding`);
  return res.data;
};

export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};
