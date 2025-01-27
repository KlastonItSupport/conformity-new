import { api } from "api/api";
import { createContext, useContext, useRef, useState } from "react";

import { toast } from "react-toastify";
import i18n from "../i18n/index";
import { AuthContext } from "./auth";
import { AUDIT_EVENTS } from "constants/audit-events";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [deleteId, setDeleteId] = useState();
  const [editId, setEditId] = useState();
  const [editPassword, setEditPasswordId] = useState();
  const [selectedItems, setSelectedItems] = useState([]);

  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const [selectedIsLoading, setSelectedIsLoading] = useState(false);
  const [createUserIsLoading, setCreateUserIsLoading] = useState(false);
  const [changePasswordIsLoading, setChangePasswordIsLoading] = useState(false);
  const [editIsLoading, setEditIsLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const editFormRef = useRef(null);

  const changeDeleteId = (id) => {
    setDeleteId(id);
  };

  const getUsersFromThisCompany = async (page = 1, search = "", limit = 10) => {
    try {
      const response = await api.get(
        `/users?page=${page}&search=${search}&pageSize=${limit}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setUsers(response.data.items);
      setPagination(response.data.pages);
      return response.data;
    } catch (_) {}
  };

  const changePassword = async (newPassword) => {
    setChangePasswordIsLoading(true);
    try {
      await api.post(
        "/users/change-password",
        {
          id: editPassword.id,
          token: getToken(),
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-audit-event": AUDIT_EVENTS.COMPANY_USERS_CHANGE_PASSWORD,
          },
        }
      );

      toast.success(i18n.t("Senha alterada com sucesso"));
    } catch (_) {
      toast.error(i18n.t("Erro ao alterar a senha"));
    }
    setChangePasswordIsLoading(false);
  };

  const createUser = async (data) => {
    try {
      setCreateUserIsLoading(true);
      const response = await api.post(
        "/users",
        {
          ...data,
          companyId: getUserInfo().companyId,
          access: data.status,
          contractAccess: false,
          leadAccess: false,
          projectAccess: false,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-audit-event": AUDIT_EVENTS.COMPANY_USERS_CREATED,
          },
        }
      );

      if (response.status === 201) {
        toast.success(i18n.t("Usuário criado com sucesso"));
        setUsers([response.data, ...users]);
        setCreateUserIsLoading(false);

        return response.data;
      }
    } catch (e) {
      if ((e.status = 409)) {
        toast.error(i18n.t("Ja existe um usuário com este email"));
        setCreateUserIsLoading(false);

        return false;
      }
    }
    setCreateUserIsLoading(false);
  };

  const deleteUser = async (id) => {
    try {
      setDeleteIsLoading(true);
      const response = await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_USERS_DELETED,
        },
      });
      if (response.status === 200) {
        setDeleteIsLoading(false);
        setUsers(users.filter((user) => user.id !== id));
        toast.success(i18n.t("Usuário deletado com sucesso"));
      }
    } catch (e) {
      toast.error(i18n.t("Ocorreu um erro"));
    }
  };

  const editUser = async (data) => {
    try {
      setEditIsLoading(true);
      
      // Asegurarse de que el companyId sea una string
      const userData = {
        ...data,
        companyId: String(data.companyId),
      };

      console.log('Sending user data:', userData); // Debug log

      const response = await api.patch(`/users/${editId.id}`, userData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_USERS_UPDATED,
          'Content-Type': 'application/json', // Añadir explícitamente el Content-Type
        },
      });

      if (response.data) {
        const editedUserIndex = users.findIndex(
          (user) => user.id === response.data.id
        );

        const updatedUsers = [...users];
        updatedUsers[editedUserIndex] = {
          ...response.data,
          companyId: userData.companyId, // Asegurarse de mantener el companyId correcto
        };
        setUsers(updatedUsers);

        toast.success(i18n.t("Usuário editado com sucesso"));
        return true;
      } else {
        toast.error(i18n.t("Resposta inválida da API ao editar usuário"));
        return false;
      }
    } catch (error) {
      console.error("Error editing user:", error);
      toast.error(i18n.t("Ocorreu um erro ao editar usuário"));
      return false;
    } finally {
      setEditIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        deleteId,
        changeDeleteId,
        editId,
        setEditId,
        users,
        setUsers,
        editFormRef,
        getUsersFromThisCompany,
        deleteUser,
        deleteIsLoading,
        selectedItems,
        setSelectedItems,
        selectedIsLoading,
        setSelectedIsLoading,
        createUser,
        createUserIsLoading,
        changePassword,
        changePasswordIsLoading,
        editPassword,
        setEditPasswordId,
        editUser,
        editIsLoading,
        pagination,
        setPagination,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
