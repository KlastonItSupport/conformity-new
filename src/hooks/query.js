const { useLocation } = require("react-router-dom");

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
