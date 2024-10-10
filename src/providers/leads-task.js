import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { toast } from "react-toastify";

const LeadTaskContext = createContext();

const LeadTaskProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);

  const getLeadsTasks = async (page = 1, search = "", id = null) => {
    const response = await api.get(
      `/leads/tasks?search=${search}&page=${page}${id ? `&leadId=${id}` : ""}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  };

  const getTaskByLeadId = async (leadId, page = 1, search = "") => {
    const response = await api.get(
      `/leads/tasks/${leadId}&page=${page}&search=${search}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response.data;
  };

  const createTaskLead = async (data) => {
    const response = await api.post(`/leads/tasks`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 201) {
      toast.success("Tarefa criada com sucesso!");
    }

    return response.data;
  };

  const deleteTaskLead = async (id, showToast = true) => {
    console.log("id", id);
    const response = await api.delete(`/leads/tasks/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 200 && showToast) {
      toast.success("Tarefa excluída com sucesso!");
    }

    return response.data;
  };

  const deleteMultipleTaskLead = async (selecteds, setLeads, leads) => {
    const deletePromises = selecteds.map((selected) =>
      deleteTaskLead(selected.id, false)
    );
    await Promise.all(deletePromises);
    setLeads(
      leads.filter(
        (category) => !selecteds.some((selected) => selected.id === category.id)
      )
    );

    toast.success("Tarefas deletados com sucesso!");
  };

  const editTaskLead = async (taskLeadId, task) => {
    const res = await api.patch(`/leads/tasks/${taskLeadId}`, task);

    if (res.status === 200) {
      toast.success("Tarefa editada com sucesso!");
    }
    return res.data;
  };

  return (
    <LeadTaskContext.Provider
      value={{
        getLeadsTasks,
        getTaskByLeadId,
        createTaskLead,
        deleteTaskLead,
        deleteMultipleTaskLead,
        editTaskLead,
      }}
    >
      {children}
    </LeadTaskContext.Provider>
  );
};

export { LeadTaskContext, LeadTaskProvider };
