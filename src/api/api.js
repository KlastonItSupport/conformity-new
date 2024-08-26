import axios from "axios";

export const api = axios.create({
  baseURL: "https://93.127.210.174:3000/",
  // baseURL: "http://localhost:3000/",
  // baseURL: "https://conformity-new-api-production.up.railway.app/",
});
