import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { toast } from "react-toastify";

const CrmContext = createContext();

const CrmProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);

  const getCrm = async (page = 1, search = "") => {
    const response = await api.get(`/crm?page=${page}&search=${search}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  };

  const deleteCrm = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/crm/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 200) {
        if (showToast) {
          toast.success("Cliente/Fornecedor excluído com sucesso");
        }
      }
      return true;
    } catch (error) {
      toast.error("Erro ao deletar cliente/fornecedor");
    }
  };

  const deleteMultipleCrm = async (selecteds, setCrm, crm) => {
    const deletePromises = selecteds.map((selected) =>
      deleteCrm(selected.id, false)
    );
    await Promise.all(deletePromises);
    setCrm(
      crm.filter(
        (category) => !selecteds.some((selected) => selected.id === category.id)
      )
    );
    toast.success("Clientes/Fornecedores excluídos com sucesso!");
  };

  const createCrm = async (data) => {
    const companyId = getUserInfo().companyId;
    const response = await api.post(
      "/crm",
      { ...data, companyId },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (response.status === 201) {
      toast.success("Cliente/Fornecedor criado com sucesso!");
    }

    return response.data;
  };

  const updateCrm = async (data) => {
    const response = await api.patch(`/crm/${data.id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 200) {
      toast.success("Cliente/Fornecedor atualizado com sucesso!");
    }

    return response.data;
  };

  return (
    <CrmContext.Provider
      value={{
        getCrm,
        deleteCrm,
        deleteMultipleCrm,
        createCrm,
        updateCrm,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export { CrmContext, CrmProvider };
