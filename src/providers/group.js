import { api } from "api/api";
import { createContext, useContext, useState } from "react";

import { AuthContext } from "./auth";
import { toast } from "react-toastify";
import i18n from "../i18n/index";

const GroupContext = createContext();

const GroupProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [deleteId, setDeleteId] = useState();
  const [editSelected, setEditSelected] = useState();
  const [selecteds, setSelecteds] = useState();

  const [groups, setGroups] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [createGroupIsLoading, setCreateGroupIsLoading] = useState(false);
  const [deleteGroupIsLoading, setDeleteGroupIsLoading] = useState(false);
  const [selectedIsLoading, setSelectedIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const itemsPerPage = 1;

  const changeGroup = (groups) => setGroups([...groups]);

  const getGroups = async (shouldSetGroups = true, page = 1, search = "") => {
    const companyId = getUserInfo().companyId;

    const response = await api.get(
      `/permissions/groups-by-company/${companyId}?page=${page}&search=${search}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (shouldSetGroups) {
      setPagination(response.data.pages);
      setGroups(response.data.items);
    }
    return response.data.items;
  };

  const createGroup = async (data) => {
    try {
      setCreateGroupIsLoading(true);

      const companyId = getUserInfo().companyId;
      const response = await api.post(
        "/permissions/create-group",
        { companyId, ...data },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      toast.success(i18n.t("Grupo Criado com sucesso"));
      setGroups([
        { ...response.data, ...response.data.permissions },
        ...groups,
      ]);
    } catch (_) {
      toast.error(i18n.t("Ocorreu um erro"));
    }
    setCreateGroupIsLoading(false);
  };

  const deleteGroup = async (id) => {
    try {
      const response = await api.delete(`permissions/group/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        setGroups([
          ...groups.filter((group) => {
            return group.id !== id;
          }),
        ]);
        toast.success(i18n.t("Grupo Deletado com sucesso"));
      }
    } catch (_) {
      toast.error(i18n.t("Ocorreu um erro"));
    }
  };

  const editGroup = async (data) => {
    try {
      setSelectedIsLoading(true);

      const response = await api.patch(`/permissions/group/${data.id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success(i18n.t("Grupo Editado com sucesso"));

      setGroups([
        { ...response.data, ...response.data.permissions },
        ...groups.filter((group) => group.id !== response.data.id),
      ]);
    } catch (_) {
      toast.error(i18n.t("Ocorreu um erro"));
    }
    setSelectedIsLoading(false);
  };

  const getUsersGroup = async (groupId) => {
    try {
      const response = await api.get(`/permissions/group/users/${groupId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (_) {
      toast.error(
        i18n.t("Ocorreu um erro ao resgatar os usuários deste grupo")
      );
    }
  };

  const handleChangeDeleteId = (id) => setDeleteId(id);
  const handleChangeSelectedsIds = (id) => setSelecteds(id);

  return (
    <GroupContext.Provider
      value={{
        deleteId,
        selecteds,
        groups,
        itemsPerPage,
        changeGroup,
        getGroups,
        createGroup,
        deleteGroup,
        handleChangeDeleteId,
        handleChangeSelectedsIds,
        setGroups,
        createGroupIsLoading,
        setCreateGroupIsLoading,
        deleteGroupIsLoading,
        setDeleteGroupIsLoading,
        editSelected,
        setEditSelected,
        editGroup,
        selected,
        setSelected,
        getUsersGroup,
        selectedIsLoading,
        setSelectedIsLoading,
        pagination,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export { GroupContext, GroupProvider };
