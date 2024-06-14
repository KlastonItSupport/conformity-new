import { api } from "api/api";
import { AuthContext } from "./auth";

const { createContext, useContext, useState, useEffect } = require("react");

const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [createCategoryIsLoading, setCreateCategoryIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const createCategory = async (data) => {
    const userInfo = getUserInfo();
    const response = await api.post(
      "categories",
      { ...data, companyId: userInfo.companyId },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    setCategories([
      ...categories,
      { label: response.data.name, value: response.data.id },
    ]);
    return response.data;
  };

  const getCategories = async () => {
    const response = await api.get("categories", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  };

  useEffect(() => {
    getCategories().then((categoryRes) => {
      setCategories(
        categoryRes.map((category) => {
          return { label: category.name, value: category.id };
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        createCategory,
        getCategories,
        createCategoryIsLoading,
        setCreateCategoryIsLoading,
        categories,
        setCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryContext, CategoryProvider };
