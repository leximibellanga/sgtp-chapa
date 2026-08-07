import axiosClient from "./axiosClient";

export function login(email, senha) {
  return axiosClient.post("/auth/login", { email, senha });
}
