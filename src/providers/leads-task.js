import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";

const LeadTaskContext = createContext();

const LeadTaskProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);

  const getLeadsTasks = async (page = 1, search = "") => {
    const response = await api.get(
      `/leads/tasks?search=${search}&page=${page}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  };

  const getTaskByLeadId = async (leadId) => {
    const response = await api.get(`/leads/tasks/${leadId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  };

  return (
    <LeadTaskContext.Provider value={{ getLeadsTasks, getTaskByLeadId }}>
      {children}
    </LeadTaskContext.Provider>
  );
};

export { LeadTaskContext, LeadTaskProvider };
