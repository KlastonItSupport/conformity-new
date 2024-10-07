import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [status, setStatus] = useState({
    started: 0,
    stopped: 0,
    ended: 0,
    inProgress: 0,
  });

  const handlingFilterParams = (filterParams) => {
    const filters = filterParams;

    const filtersParam = Object.keys(filters)
      .filter(
        (key) =>
          filters[key] !== undefined &&
          filters[key] !== null &&
          filters[key] !== "not-selected"
      )
      .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
      .join("&");

    return filtersParam ? `${filtersParam}` : "";
  };

  const createProject = async (data) => {
    try {
      const response = await api.post(
        "/projects",
        { ...data, companyId: getUserInfo().companyId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if ((response.status = 201)) {
        toast.success("Projeto criado com sucesso!");

        await getProjectStatus();
        return response.data;
      }
    } catch (e) {
      toast.error("Erro ao criar projeto");
    }
  };

  const getProjects = async (page = 1, search = "", filters = {}) => {
    console.log("filters, ", filters);
    const filterParamsParsed = handlingFilterParams(filters);

    const response = await api.get(
      `/projects?page=${page}&search=${search}&${filterParamsParsed}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    await getProjectStatus();
    return response.data;
  };

  const deleteProject = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        if (showToast) {
          toast.success("Projeto excluído com sucesso");
          await getProjectStatus();
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar Projeto");
      }
    }
  };

  const deleteMultipleProjects = async (selecteds, setProjects, projects) => {
    const deletePromises = selecteds.map((selected) =>
      deleteProject(selected.id, false)
    );
    await Promise.all(deletePromises);

    setProjects(
      projects.filter(
        (contract) => !selecteds.some((selected) => selected.id === contract.id)
      )
    );

    await getProjectStatus();
    toast.success("Projetos excluídos com sucesso!");
  };

  const getProjectStatus = async () => {
    const status = await api.get("projects/status", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setStatus(status.data);
  };

  const editProject = async (id, data) => {
    const res = await api.patch(`projects/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    console.log(res.status);
    if (res.status === 200) {
      toast.success("Projeto editado com sucesso!");
      await getProjectStatus();
      return res.data;
    }
    return res.data;
  };

  return (
    <ProjectContext.Provider
      value={{
        getProjects,
        deleteProject,
        deleteMultipleProjects,
        createProject,
        status,
        editProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext, ProjectProvider };
