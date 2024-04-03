import axios from "axios";

export const api = axios.create({
  baseURL: "https://conformity-new-api-production.up.railway.app/",
});
