import axios from "axios";

export const api = axios.create({
  baseURL: "http://167.71.98.71:3000/",
});
