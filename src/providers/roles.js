import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const RolesContext = createContext();

const RolesProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);

  const getRoles = async (page = 1, search = "") => {
    const response = await api.get(`/roles?page=${page}&search=${search}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  };

  const createRole = async (data) => {
    try {
      const userInfo = getUserInfo();
      const response = await api.post(
        "/roles",
        {
          ...data,
          companyId: userInfo.companyId,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-audit-event": AUDIT_EVENTS.COMPANY_ROLES_CREATED,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Cargo criado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar Cargo");
    }
  };

  const deleteRole = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_ROLES_DELETED,
        },
      });

      if (response.status === 200) {
        if (showToast) {
          toast.success("Cargo deletado com sucesso");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar Cargo");
      }
    }
  };

  const deleteMultipleRoles = async (selecteds, setServices, services) => {
    const deletePromises = selecteds.map((selected) =>
      deleteRole(selected.id, false)
    );
    await Promise.all(deletePromises);

    setServices(
      services.filter(
        (service) => !selecteds.some((selected) => selected.id === service.id)
      )
    );
    toast.success("Cargos excluídos com sucesso!");
  };

  const editRole = async (data) => {
    const response = await api.patch(`roles/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.COMPANY_ROLES_UPDATED,
      },
    });

    if (response.status === 200) {
      toast.success("Cargo editado com sucesso");

      return response.data;
    }
  };

  return (
    <RolesContext.Provider
      value={{
        getRoles,
        createRole,
        deleteRole,
        deleteMultipleRoles,
        editRole,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

export { RolesContext, RolesProvider };
