import { api } from "api/api";
import { AuthContext } from "./auth";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const BlogContext = createContext();

const BlogProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);

  const createBlogPost = async (data) => {
    const response = await api.post(
      "/blog",
      { ...data, author: "", companyId: getUserInfo().companyId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_BLOG_CREATED,
        },
      }
    );

    return response.data;
  };

  const editBlog = async (data) => {
    const response = await api.patch(
      `/blog/${data.id}`,
      { ...data, companyId: getUserInfo().companyId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_BLOG_UPDATED,
        },
      }
    );

    return response.data;
  };

  const getBlog = async (page = 1, search = "", limit = 10) => {
    const response = await api.get(
      `/blog?page=${page}&search=${search}&pageSize=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  };

  const deleteBlog = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_BLOG_DELETED,
        },
      });

      if (response.status === 200) {
        if (showToast) {
          toast.success("Blog deletado com sucesso");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar Blog");
      }
    }
  };

  const deleteMultipleBlog = async (selecteds, setServices, services) => {
    const deletePromises = selecteds.map((selected) =>
      deleteBlog(selected.id, false)
    );
    await Promise.all(deletePromises);

    setServices(
      services.filter(
        (service) => !selecteds.some((selected) => selected.id === service.id)
      )
    );
    toast.success("Posts do Blog excluídos com sucesso!");
  };

  return (
    <BlogContext.Provider
      value={{
        getBlog,
        deleteBlog,
        deleteMultipleBlog,
        createBlogPost,
        editBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export { BlogContext, BlogProvider };
