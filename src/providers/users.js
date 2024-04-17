import { api } from "api/api";
import { createContext, useContext, useRef, useState } from "react";

import { toast } from "react-toastify";
import { AuthContext } from "./auth";

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
  const editFormRef = useRef(null);

  const changeDeleteId = (id) => {
    setDeleteId(id);
  };

  const getUsersFromThisCompany = async () => {
    const response = await api.get("/users", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setUsers(response.data);
    return response.data;
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
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      toast.success("Senha alterada com sucesso");
    } catch (_) {
      toast.error("Erro ao alterar a senha");
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
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.status === 201) {
        toast.success("Usuário criado com sucesso");
        setUsers([response.data, ...users]);
      }
    } catch (e) {
      if ((e.status = 409)) {
        toast.error("Ja existe um usuário com este email");
      }
    }
    setCreateUserIsLoading(false);
  };

  const deleteUser = async (id) => {
    try {
      setDeleteIsLoading(true);
      const response = await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 200) {
        setDeleteIsLoading(false);
        setUsers(users.filter((user) => user.id !== id));
        toast.success("Usuário deletado com sucesso");
      }
    } catch (e) {
      toast.error("Ocorreu um erro");
    }
  };

  const editUser = async (data) => {
    try {
      setEditIsLoading(true);

      const response = await api.patch(`/users/${editId.id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.data) {
        const editedUserIndex = users.findIndex(
          (user) => user.id === response.data.id
        );

        const updatedUsers = [...users];

        updatedUsers[editedUserIndex] = response.data;

        setUsers(updatedUsers);

        toast.success("Usuário editado com sucesso");
      } else {
        toast.error("Resposta inválida da API ao editar usuário");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao editar usuário");
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
