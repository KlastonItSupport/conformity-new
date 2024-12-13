import { useContext, createContext } from "react";
import { AuthContext } from "./auth";
import { api } from "api/api";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const DetailsTaskContext = createContext();

const DetailsTaskProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);

  const checkPermissionToDetailsTask = async (id) => {
    const response = await api.get(`/tasks-details/permissions/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  };

  const getSpecificTask = async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_GET,
        },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  const getEvaluators = async (id) => {
    try {
      const response = await api.get(`/tasks-details/evaluators/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      return response.data;
    } catch (error) {}
  };

  const deleteEvaluator = async (id) => {
    try {
      const response = await api.delete(`/tasks-details/evaluators/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_DELETE_EVALUATOR,
        },
      });

      if (response.status === 200) {
        toast.success("Avaliador excluído com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao excluir avaliador");
    }
  };

  const addEvaluator = async (id, usersIds) => {
    try {
      const response = await api.post(
        `/tasks-details/evaluators`,
        {
          usersIds: [...usersIds],
          taskId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_ADD_EVALUATOR,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Avaliador adicionado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao adicionarx avaliador");
    }
  };

  const handleTaskStatus = async (id) => {
    try {
      const response = await api.get(
        `/tasks/close-task/${id}`,

        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_CHANGE_STATUS,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Status alterado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao alterar status");
    }
  };

  const getAdditionalDocuments = async (id) => {
    try {
      const response = await api.get(`/tasks/additional-documents/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  const onAddAttachments = async (data) => {
    try {
      const response = await api.post(`/tasks/additional-documents`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_ADD_ATTACHMENT,
        },
      });

      if (response.status === 201) {
        toast.success("Anexo adicionado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao adicionar anexo");
    }
  };

  const deleteAttachment = async (id) => {
    try {
      const response = await api.delete(`/tasks/additional-documents/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_DELETE_ATTACHMENT,
        },
      });

      if (response.status === 200) {
        toast.success("Anexo excluído com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao excluir anexo");
    }
  };

  const changeTaskPrevision = async (data) => {
    try {
      const response = await api.post(`tasks-details/deadlines`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_CHANGE_PREVISION,
        },
      });

      if (response.status === 201) {
        toast.success("Previsão alterada com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao alterar previsão");
    }
  };
  const getPrevisionsHistory = async (id) => {
    try {
      const response = await api.get(`/tasks-details/deadlines/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  return (
    <DetailsTaskContext.Provider
      value={{
        handleTaskStatus,
        getAdditionalDocuments,
        getSpecificTask,
        getEvaluators,
        deleteEvaluator,
        addEvaluator,
        onAddAttachments,
        deleteAttachment,
        changeTaskPrevision,
        getPrevisionsHistory,
        checkPermissionToDetailsTask,
      }}
    >
      {children}
    </DetailsTaskContext.Provider>
  );
};

export { DetailsTaskContext, DetailsTaskProvider };
