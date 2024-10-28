import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { toast } from "react-toastify";
const SchoolContext = createContext();

const SchoolProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);

  const getSchools = async (page = 1, search = "") => {
    const response = await api.get(`/schools?page=${page}&search=${search}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  };

  const createSchool = async (data) => {
    try {
      const userInfo = getUserInfo();
      const response = await api.post("/schools", {
        ...data,
        companyId: userInfo.companyId,
      });

      if (response.status === 201) {
        toast.success("Serviço criado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar serviço");
    }
  };

  const editSchool = async (data, id) => {
    const response = await api.patch(`schools/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 200) {
      toast.success("Serviço editado com sucesso");

      return response.data;
    }
  };

  const deleteSchool = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/schools/${id}`);

      if (response.status === 200) {
        if (showToast) {
          toast.success("Escola deletada com sucesso");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar escola");
      }
    }
  };

  const deleteMultipleSchools = async (selecteds, setServices, services) => {
    const deletePromises = selecteds.map((selected) =>
      deleteSchool(selected.id, false)
    );
    await Promise.all(deletePromises);

    setServices(
      services.filter(
        (service) => !selecteds.some((selected) => selected.id === service.id)
      )
    );
    toast.success("Escolas excluídas com sucesso!");
  };

  return (
    <SchoolContext.Provider
      value={{
        getSchools,
        deleteSchool,
        deleteMultipleSchools,
        createSchool,
        editSchool,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export { SchoolContext, SchoolProvider };