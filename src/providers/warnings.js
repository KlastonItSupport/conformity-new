import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { toast } from "react-toastify";

const WarningsContext = createContext();

const WarningsProvider = ({ children }) => {
  const { getUserInfo, getToken } = useContext(AuthContext);

  const createWarning = async (data) => {
    try {
      const userInfo = getUserInfo();
      const response = await api.post("/warnings", {
        ...data,
        companyId: userInfo.companyId,
      });

      if (response.status === 201) {
        toast.success("Aviso criado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar Aviso");
    }
  };

  const getWarnings = async () => {
    const userInfo = getUserInfo();
    const response = await api.get(`/warnings/${userInfo.id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  };

  const readWarning = async (warningId) => {
    const userInfo = getUserInfo();
    const response = await api.post(`/warnings/read-warning`, {
      warningId,
      userId: userInfo.id,
    });

    return response.data;
  };

  return (
    <WarningsContext.Provider
      value={{ createWarning, getWarnings, readWarning }}
    >
      {children}
    </WarningsContext.Provider>
  );
};

export { WarningsContext, WarningsProvider };
