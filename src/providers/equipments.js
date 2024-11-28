import { api } from "api/api";
import { AuthContext } from "./auth";
import { toast } from "react-toastify";

import { createContext, useContext, useState } from "react";
import { AUDIT_EVENTS } from "constants/audit-events";

const EquipmentContext = createContext();

const EquipmentProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const [equipments, setEquipments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [actions, setActions] = useState([]);
  const [paginationActions, setPaginationActions] = useState(null);

  const getEquipments = async (page = 1, search = "", limit = 10) => {
    const response = await api.get(
      `equipments?page=${page}&search=${search}&pageSize=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_LIST,
        },
      }
    );
    setEquipments(response.data.items);
    setPagination(response.data.pages);

    return response.data;
  };

  const createEquipment = async (data) => {
    const response = await api.post("equipments", data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_CREATED,
      },
    });

    setEquipments([...equipments, response.data]);
  };

  const updateEquipment = async (data, id) => {
    const response = await api.patch(`equipments/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_UPDATED,
      },
    });

    if (response.status === 200) {
      toast.success("Equipamento atualizado com sucesso");
      setEquipments(
        equipments.map((equipment) => {
          if (equipment.id === id) {
            return { ...equipment, ...data };
          }
          return equipment;
        })
      );
    }
  };

  const deleteEquipment = async (id, showToast = true) => {
    const response = await api.delete(`equipments/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_DELETED,
      },
    });
    if (response.status === 200) {
      if (showToast) {
        toast.success("Equipamento excluído com sucesso");
        setEquipments(equipments.filter((equipment) => equipment.id !== id));
      }
    }
  };

  const deleteMultipleEquipments = async (selectedItems) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall"
        ? deleteEquipment(selected.id, false)
        : () => {}
    );
    await Promise.all(deletePromises);

    setEquipments(
      equipments.filter(
        (equipment) =>
          !selectedItems.some((selected) => selected.id === equipment.id)
      )
    );

    toast.success("Equipamentos excluídos com sucesso!");
  };

  const getActions = async (page = 1, search = "", limit = 10, id) => {
    const response = await api.get(
      `equipments/actions/${id}?page=${page}&search=${search}&pageSize=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_GET_ACTIONS,
        },
      }
    );

    setActions(response.data.items);
    setPaginationActions(response.data.pages);

    return response.data;
  };

  const createActions = async (data) => {
    const response = await api.post("equipments/actions", data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_CREATE_ACTIONS,
      },
    });

    setActions([...actions, response.data]);
  };

  const updateActions = async (data, id) => {
    const response = await api.patch(`equipments/actions/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_UPDATE_ACTIONS,
      },
    });
    if (response.status === 200) {
      toast.success("Ação atualizada com sucesso");
      setActions(
        actions.map((action) => {
          if (action.id === id) {
            return { ...action, ...data };
          }
          return action;
        })
      );
    }
  };

  const deleteActions = async (id, showToast = true) => {
    const response = await api.delete(`equipments/actions/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_DELETE_ACTIONS,
      },
    });
    if (response.status === 200) {
      if (showToast) {
        toast.success("Ação excluída com sucesso");
        setActions(actions.filter((action) => action.id !== id));
      }
    }
  };

  const deleteMultipleActions = async (selectedItems) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall" ? deleteActions(selected.id, false) : () => {}
    );
    await Promise.all(deletePromises);

    setActions(
      actions.filter(
        (action) => !selectedItems.some((selected) => selected.id === action.id)
      )
    );

    toast.success("Ações excluídas com sucesso!");
  };

  return (
    <EquipmentContext.Provider
      value={{
        getEquipments,
        equipments,
        setEquipments,
        pagination,
        setPagination,
        deleteEquipment,
        createEquipment,
        updateEquipment,
        deleteMultipleEquipments,
        createActions,
        getActions,
        actions,
        setActions,
        paginationActions,
        setPaginationActions,
        updateActions,
        deleteActions,
        deleteMultipleActions,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export { EquipmentContext, EquipmentProvider };
