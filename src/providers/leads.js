import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const LeadsContext = createContext();

const LeadsProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const [contractStatus, setContractStatus] = useState([]);

  const getLeads = async (page = 1, search = "") => {
    const response = await api.get(`/leads?page=${page}&search=${search}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    await getContractStatus();
    return response.data;
  };

  const createLead = async (data) => {
    const response = await api.post("/leads", data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 201) {
      toast.success("Lead criado com sucesso!");
      return response.data;
    }

    await getContractStatus();
    return response.data;
  };

  const deleteLead = async (id) => {
    const response = await api.delete(`/leads/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 200) {
      toast.success("Lead deletado com sucesso!");
    }

    await getContractStatus();
    return response.data;
  };

  const deleteMultipleLeads = async (selecteds, setLeads, leads) => {
    const deletePromises = selecteds.map((selected) => deleteLead(selected.id));
    await Promise.all(deletePromises);
    setLeads(
      leads.filter(
        (category) => !selecteds.some((selected) => selected.id === category.id)
      )
    );

    await getContractStatus();
    toast.success("Leads deletados com sucesso!");
  };

  const editLead = async (id, data) => {
    const response = await api.patch(`/leads/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 200) {
      toast.success("Lead editado com sucesso");
    }
    await getContractStatus();
    return response.data;
  };

  const getContractStatus = async () => {
    const res = await api.get("leads/status", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setContractStatus(res.data);
  };
  return (
    <LeadsContext.Provider
      value={{
        getLeads,
        deleteLead,
        deleteMultipleLeads,
        createLead,
        editLead,
        contractStatus,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export { LeadsContext, LeadsProvider };
