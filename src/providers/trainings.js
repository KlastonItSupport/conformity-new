import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const TrainingContext = createContext();

const TrainingProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);

  const getTrainings = async (page = 1, search = "", limit = 10) => {
    const response = await api.get(
      `/trainings?page=${page}&search=${search}&pageSize=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response.data;
  };

  const createTraining = async (data) => {
    try {
      const response = await api.post(
        "/trainings",
        {
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-audit-event": AUDIT_EVENTS.TRAININGS_CREATED,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Treinamento criado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar Treinamento");
    }
  };

  const editTraining = async (data, id) => {
    const response = await api.patch(`trainings/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.TRAININGS_UPDATED,
      },
    });

    if (response.status === 200) {
      toast.success("Treinamento editado com sucesso");

      return response.data;
    }
  };

  const deleteTraining = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/trainings/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TRAININGS_DELETED,
        },
      });

      if (response.status === 200) {
        if (showToast) {
          toast.success("Treinamento deletado com sucesso");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar treinamento");
      }
    }
  };

  const deleteMultipleTrainings = async (selecteds, setServices, services) => {
    const deletePromises = selecteds.map((selected) =>
      deleteTraining(selected.id, false)
    );
    await Promise.all(deletePromises);

    setServices(
      services.filter(
        (service) => !selecteds.some((selected) => selected.id === service.id)
      )
    );
    toast.success("Treinamentos excluídas com sucesso!");
  };

  return (
    <TrainingContext.Provider
      value={{
        getTrainings,
        deleteTraining,
        deleteMultipleTrainings,
        createTraining,
        editTraining,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export { TrainingContext, TrainingProvider };
