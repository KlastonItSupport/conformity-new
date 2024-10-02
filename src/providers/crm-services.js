import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { toast } from "react-toastify";

const CrmServicesContext = createContext();

const CrmServicesProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);

  const getServices = async (page = 1, search = "") => {
    const response = await api.get(`/services?page=${page}&search=${search}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  };

  const createService = async (data) => {
    try {
      const userInfo = getUserInfo();
      const response = await api.post("/services", {
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

  const deleteService = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/services/${id}`);

      if (response.status === 200) {
        if (showToast) {
          toast.success("Serviço deletado com sucesso");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar serviço");
      }
    }
  };

  const deleteMultipleservices = async (selecteds, setServices, services) => {
    const deletePromises = selecteds.map((selected) =>
      deleteService(selected.id, false)
    );
    await Promise.all(deletePromises);

    setServices(
      services.filter(
        (service) => !selecteds.some((selected) => selected.id === service.id)
      )
    );
    toast.success("Serviços excluídos com sucesso!");
  };

  const editService = async (data) => {
    const response = await api.patch(`services/${data.id}`, data);

    if (response.status === 200) {
      toast.success("Serviço editado com sucesso");

      return response.data;
    }
  };

  return (
    <CrmServicesContext.Provider
      value={{
        getServices,
        createService,
        deleteService,
        deleteMultipleservices,
        editService,
      }}
    >
      {children}
    </CrmServicesContext.Provider>
  );
};

export { CrmServicesContext, CrmServicesProvider };
