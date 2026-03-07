import api from "./api";

export const loginUser = async (credentials) => {

  const res = await api.post("/auth/login", credentials);

  return res.data;
};

export const registerUser = async (data) => {

  const res = await api.post("/auth/register", data);

  return res.data;
};

export const resetPassword = async (data) => {

  const res = await api.post("/auth/reset-password", data);

  return res.data;

};