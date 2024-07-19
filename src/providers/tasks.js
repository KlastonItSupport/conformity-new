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

  const getTypes = async () => {
    try {
      const response = await api.get("/types", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  const getClassifications = async () => {
    try {
      const response = await api.get("/classifications", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  const getOrigins = async () => {
    try {
      const response = await api.get("/origins", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
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
        getTypes,
        deleteMultipleTasks,
        editTask,
        origins,
        setOrigins,
        classifications,
        setClassifications,
        types,
        setTypes,
        departaments,
        setDepartaments,
        responsables,
        setResponsables,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export { TasksContext, TasksProvider };
