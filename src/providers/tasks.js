import { createContext, useContext, useState } from "react";
import { AuthContext } from "./auth";
import { api } from "api/api";
import { toast } from "react-toastify";
import { notSelectedCleaning } from "helpers/not-selected-cleaning";

const TasksContext = createContext();

const TasksProvider = ({ children }) => {
  const [pagination, setPagination] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [origins, setOrigins] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [types, setTypes] = useState([]);
  const [departaments, setDepartaments] = useState([]);
  const [responsables, setResponsables] = useState([]);

  const { getToken } = useContext(AuthContext);

  const handlingFilterParams = (filterParams) => {
    const filters = filterParams;

    const filtersParam = Object.keys(filters)
      .filter((key) => filters[key] !== undefined && filters[key] !== null)
      .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
      .join("&");

    return filtersParam ? `${filtersParam}` : "";
  };

  const getSpecificTask = async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao obter documento");
    }
  };

  const getTasks = async (page = 1, search = "", filterParams = {}) => {
    try {
      const searchParam = `search=${search ?? ""}&pageSize=10`;
      const filterParamsParsed = handlingFilterParams(filterParams);

      const response = await api.get(
        `/tasks?page=${page}&${searchParam}&${filterParamsParsed}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (response.status === 200) {
        setPagination(response.data.pages);

        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao obter documentos");
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        toast.success("Task excluída com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao deletar documento");
    }
  };

  const deleteMultipleTasks = async (selectedItems) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall" ? deleteTask(selected.id) : () => {}
    );
    await Promise.all(deletePromises);

    setTasks(
      tasks.filter(
        (task) => !selectedItems.some((selected) => selected.id === task.id)
      )
    );

    toast.success("Tarefas excluídas com sucesso!");
  };

  const editTask = async (data) => {
    try {
      notSelectedCleaning(data);
      const response = await api.patch(`/tasks/${data.id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        toast.success("Task editada com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao editar task");
    }
  };

  const createTask = async (data) => {
    try {
      notSelectedCleaning(data);
      const response = await api.post("/tasks", data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 201) {
        toast.success("Task criada com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar task");
    }
  };

  const getTypes = async (page = 1, search = "") => {
    try {
      const response = await api.get(
        `/types?page=${page}&search=${search}&pageSize=10`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  const deleteType = async (id) => {
    try {
      const response = await api.delete(`/types/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        toast.success("Tipo excluído com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao deletar tipo");
    }
  };
  const deleteMultipleTypes = async (selectedItems, setTypes, types) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall" ? deleteType(selected.id) : () => {}
    );
    await Promise.all(deletePromises);

    setTypes(
      types.filter(
        (type) => !selectedItems.some((selected) => selected.id === type.id)
      )
    );

    toast.success("Tipos excluídos com sucesso!");
  };

  const getClassifications = async (page = 1, search = "", limit = 10) => {
    try {
      const response = await api.get(
        `/classifications?page=${page}&search=${search}&pageSize=${limit}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return [];
    }
  };

  const deleteClassification = async (id) => {
    try {
      const response = await api.delete(`/classifications/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        toast.success("Classificação excluída com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao deletar classificação");
    }
  };

  const deleteMultipleClassifications = async (
    selectedItems,
    setClassifications,
    classifications
  ) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall" ? deleteClassification(selected.id) : () => {}
    );
    await Promise.all(deletePromises);
    setClassifications(
      classifications.filter(
        (classification) =>
          !selectedItems.some((selected) => selected.id === classification.id)
      )
    );
    toast.success("Classificações excluídas com sucesso!");
  };

  const getOrigins = async (page = 1, search = "") => {
    try {
      const response = await api.get(
        `/origins?page=${page}&search=${search}&pageSize=10`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  const deleteOrigin = async (id) => {
    try {
      const response = await api.delete(`/origins/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        toast.success("Origem excluída com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao deletar origem");
    }
  };

  const deleteMultipleOrigins = async (selectedItems, setOrigins, origins) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall" ? deleteOrigin(selected.id) : () => {}
    );
    await Promise.all(deletePromises);

    setOrigins(
      origins.filter(
        (origin) => !selectedItems.some((selected) => selected.id === origin.id)
      )
    );

    toast.success("Origens excluídas com sucesso!");
  };

  const createOrigins = async (data) => {
    try {
      const response = await api.post("/origins", data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 201) {
        toast.success("Origem criada com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar origem");
    }
  };

  const editOrigins = async (data) => {
    try {
      const response = await api.patch(`/origins/${data.id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        toast.success("Origem editada com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao editar origem");
    }
  };
  return (
    <TasksContext.Provider
      value={{
        getTasks,
        tasks,
        setTasks,
        pagination,
        deleteTask,
        createTask,
        getOrigins,
        getClassifications,
        deleteMultipleClassifications,
        deleteClassification,
        getTypes,
        deleteType,
        deleteMultipleTypes,
        deleteMultipleTasks,
        editTask,
        origins,
        deleteOrigin,
        deleteMultipleOrigins,
        createOrigins,
        editOrigins,
        setOrigins,
        classifications,
        setClassifications,
        types,
        setTypes,
        departaments,
        setDepartaments,
        responsables,
        setResponsables,
        getSpecificTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export { TasksContext, TasksProvider };
