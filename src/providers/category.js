import { api } from "api/api";
import { AuthContext } from "./auth";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const { createContext, useContext, useState, useEffect } = require("react");

const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [createCategoryIsLoading, setCreateCategoryIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [editIsLoading, setEditIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const createCategory = async (data) => {
    const userInfo = getUserInfo();
    const response = await api.post(
      "categories",
      { ...data, companyId: userInfo.companyId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.DOCUMENTS_ADD_CATEGORY,
        },
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
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.DOCUMENTS_LIST_CATEGORIES,
      },
    });

    return response.data;
  };

  const getCategoriesPaginated = async (
    page = 1,
    search = "",
    pageSize = 10
  ) => {
    const response = await api.get(
      `/categories?page=${page}&search=${search}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    setPagination(response.data.pages);
    return response.data.items;
  };

  const deleteCategory = async (id) => {
    const response = await api.delete(`categories/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.DOCUMENTS_DELETE_CATEGORY,
      },
    });

    if (response.status === 200) {
      setCategoriesList(
        categoriesList.filter((category) => category.id !== id)
      );
      toast.success("Categoria excluída com sucesso!");
    }
  };

  const deleteMultipleCategories = async (selectedItems) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall" ? deleteCategory(selected.id) : () => {}
    );
    await Promise.all(deletePromises);

    setCategoriesList(
      categoriesList.filter(
        (category) =>
          !selectedItems.some((selected) => selected.id === category.id)
      )
    );

    toast.success("Categorias excluídas com sucesso!");
  };

  const editCategory = async (id, data) => {
    const response = await api.patch(`categories/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.DOCUMENTS_UPDATE_CATEGORY,
      },
    });

    if (response.status === 200) {
      setCategoriesList(
        categoriesList.map((category) => {
          if (category.id === id) {
            return { ...category, ...data };
          }
          return category;
        })
      );
    }
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
        deleteCategory,
        categoriesList,
        setCategoriesList,
        editCategory,
        setEditIsLoading,
        editIsLoading,
        getCategoriesPaginated,
        pagination,
        setPagination,
        deleteMultipleCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryContext, CategoryProvider };
