import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-new-klaston.vercel.app",
  // baseURL: "http://localhost:3000/",
  // baseURL: "https://conformity-new-api-production.up.railway.app/",
});
api.interceptors.request.use(request => {
  console.group('🌐 API Request');
  console.log('URL:', request.baseURL + request.url);
  console.log('Method:', request.method?.toUpperCase());
  console.log('Headers:', request.headers);
  console.log('Data:', request.data);
  console.groupEnd();
  return request;
},
error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
}
);

// Interceptor para respuestas
api.interceptors.response.use(
  response => {
    console.group('✅ API Response');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.groupEnd();
    return response;
  },
  error => {
    console.group('❌ API Error');
    console.log('URL:', error.config?.baseURL + error.config?.url);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Full Error:', error);
    console.groupEnd();
    return Promise.reject(error);
  },
error => {
  console.group('❌ API Error');
  console.log('Status:', error.response?.status);
  console.log('Data:', error.response?.data);
  console.log('Full Error:', error);
  console.groupEnd();
  return Promise.reject(error);
}
);

export default api;