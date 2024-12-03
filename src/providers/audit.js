import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";

const AuditContext = createContext();

const AuditProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);

  const getAudit = async (page = 1, search = "") => {
    const response = await api.get(
      `audit/events?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  };

  return (
    <AuditContext.Provider value={{ getAudit }}>
      {children}
    </AuditContext.Provider>
  );
};

export { AuditContext, AuditProvider };
