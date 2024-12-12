import { api } from "api/api";
import { AuthContext } from "./auth";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";
import moment from "moment";

const BlogContext = createContext();

const BlogProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [notificationsTotal, setNotificationsTotal] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const createBlogPost = async (data) => {
    try {
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

      if (response.status === 201) {
        toast.success("Conteúdo criado com sucesso");
        updateNotifications();
      }
      return response.data;
    } catch (error) {
      toast.error("Erro ao criar conteúdo");
    }
  };

  const editBlog = async (data) => {
    try {
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

      if (response.status === 200) {
        toast.success("Conteúdo atualizado com sucesso");
      }
      return response.data;
    } catch (error) {
      toast.error("Erro ao atualizar conteúdo");
    }
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

  const getBlogPost = async (id) => {
    const response = await api.get(`/blog/details/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

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
          updateNotifications();
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

  const updateNotifications = async () => {
    getBlog(1, "", 10000).then((data) => {
      setNotifications(
        data.items.map((item) => {
          return {
            id: item.id,
            title: item.title,
            description: item.resume,
            date: moment(item.exbitionDate).format("DD/MM/YYYY"),
          };
        })
      );
      setNotificationsTotal(data.items.length);
    });
  };

  return (
    <BlogContext.Provider
      value={{
        getBlog,
        deleteBlog,
        deleteMultipleBlog,
        createBlogPost,
        editBlog,
        getBlogPost,
        notifications,
        notificationsTotal,
        setNotificationsTotal,
        updateNotifications,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export { BlogContext, BlogProvider };
