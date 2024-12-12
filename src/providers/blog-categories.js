import { api } from "api/api";
import { AuthContext } from "./auth";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const BlogCategoriesContext = createContext();

const BlogCategoriesProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);

  const createBlogCategory = async (data) => {
    const response = await api.post(
      "/blog/category",
      { ...data, companyId: getUserInfo().companyId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_BLOG_CATEGORIES_CREATED,
        },
      }
    );

    return response.data;
  };

  const editBlogCategory = async (data) => {
    const response = await api.patch(
      `/blog/category/${data.id}`,
      { ...data, companyId: getUserInfo().companyId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_BLOG_CATEGORIES_UPDATED,
        },
      }
    );

    return response.data;
  };

  const getBlogCategories = async (page = 1, search = "") => {
    const response = await api.get(
      `/blog/category?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  };

  const deleteBlogCategory = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/blog/category/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_BLOG_CATEGORIES_DELETED,
        },
      });

      if (response.status === 200) {
        if (showToast) {
          toast.success("Categoria do Blog deletado com sucesso");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar Categoria do Blog");
      }
    }
  };

  const deleteMultipleBlogCategories = async (
    selecteds,
    setServices,
    services
  ) => {
    const deletePromises = selecteds.map((selected) =>
      deleteBlogCategory(selected.id, false)
    );
    await Promise.all(deletePromises);

    setServices(
      services.filter(
        (service) => !selecteds.some((selected) => selected.id === service.id)
      )
    );
    toast.success("Categorias do Blog excluídos com sucesso!");
  };

  return (
    <BlogCategoriesContext.Provider
      value={{
        getBlogCategories,
        deleteBlogCategory,
        deleteMultipleBlogCategories,
        createBlogCategory,
        editBlogCategory,
      }}
    >
      {children}
    </BlogCategoriesContext.Provider>
  );
};

export { BlogCategoriesContext, BlogCategoriesProvider };
