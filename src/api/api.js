import axios from "axios";

export const api = axios.create({
  // baseURL: "https://api.klaston.com/",
  baseURL: "http://localhost:3000/",
  // baseURL: "https://conformity-new-api-production.up.railway.app/",
});
