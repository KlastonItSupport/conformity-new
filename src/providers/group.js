import { api } from "api/api";
import { createContext, useContext, useEffect, useState } from "react";

import { AuthContext } from "./auth";
import { toast } from "react-toastify";

const GroupContext = createContext();

const GroupProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [deleteId, setDeleteId] = useState();
  const [selecteds, setSelecteds] = useState();
  const [groups, setGroups] = useState([]);
  const [createGroupIsLoading, setCreateGroupIsLoading] = useState(false);
  const [deleteGroupIsLoading, setDeleteGroupIsLoading] = useState(false);
  const itemsPerPage = 1;

  const changeGroup = (groups) => setGroups([...groups]);

  const getGroups = async () => {
    const companyId = getUserInfo().companyId;

    const response = await api.get(
      `/permissions/groups-by-company/${companyId}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    setGroups(response.data);
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
      toast.success("Grupo Criado com sucesso");
      setGroups([
        { ...response.data, ...response.data.permissions },
        ...groups,
      ]);
    } catch (_) {
      toast.error("Ocorreu um erro");
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
        toast.success("Grupo Deletado com sucesso");
      }
    } catch (_) {
      toast.error("Ocorreu um erro");
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
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export { GroupContext, GroupProvider };
