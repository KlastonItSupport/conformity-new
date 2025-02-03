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
  
      // Log inicial de datos recibidos
      console.log('1. Datos originales a editar:', {
        originalData: data,
        originalCompanyId: data.companyId,
        typeOfCompanyId: typeof data.companyId
      });
  
      const userData = {
        ...data,
        companyId: String(data.companyId),
      };
  
      // Log del estado actual y datos transformados
      console.log('2. Estado actual y datos preparados:', {
        currentUser: users.find(u => u.id === editId.id),
        transformedData: userData,
        editId
      });
      
      const response = await api.patch(`/users/${editId.id}`, userData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_USERS_UPDATED,
          'Content-Type': 'application/json',
        },
      });
  
      // Log de la respuesta de la API
      console.log('3. Respuesta de la API:', {
        status: response.status,
        responseData: response.data,
        sentCompanyId: userData.companyId,
        receivedCompanyId: response.data?.companyId
      });
  
      if (response.data) {
        // Verificar si el companyId se actualizó correctamente
        if (response.data.companyId !== userData.companyId) {
          console.warn('4. Advertencia: CompanyId no coincide:', {
            sent: userData.companyId,
            received: response.data.companyId,
            difference: 'El ID de compañía en la respuesta no coincide con el enviado'
          });
          
          // Opcional: Mostrar advertencia al usuario
          toast.warning(i18n.t("Aviso: Alguns dados podem não ter sido atualizados completamente"));
        }
  
        const updatedUser = {
          ...response.data,
          // Mantener el companyId enviado, ya que es el valor deseado
          companyId: userData.companyId,
          // Asegurarse de que otros campos críticos se mantengan
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status
        };
  
        // Log del usuario actualizado
        console.log('5. Usuario actualizado:', {
          original: users.find(u => u.id === response.data.id),
          updated: updatedUser,
          changes: {
            companyId: {
              before: users.find(u => u.id === response.data.id)?.companyId,
              after: updatedUser.companyId
            }
          }
        });
  
        const editedUserIndex = users.findIndex(
          (user) => user.id === response.data.id
        );
  
        if (editedUserIndex === -1) {
          console.error('6. Error: Usuario no encontrado en el estado actual');
          toast.error(i18n.t("Erro ao atualizar lista de usuários"));
          return false;
        }
  
        const updatedUsers = [...users];
        updatedUsers[editedUserIndex] = updatedUser;
  
        // Log antes de actualizar el estado
        console.log('7. Actualizando estado:', {
          editedUserIndex,
          previousUser: users[editedUserIndex],
          newUser: updatedUser
        });
  
        setUsers(updatedUsers);
  
        // Verificar si la actualización fue exitosa
        const userWasUpdated = JSON.stringify(updatedUsers[editedUserIndex]) === JSON.stringify(updatedUser);
        
        if (userWasUpdated) {
          toast.success(i18n.t("Usuário editado com sucesso"));
          return true;
        } else {
          console.error('8. Error: La actualización del estado no fue exitosa');
          toast.warning(i18n.t("Usuário foi editado, mas a lista pode precisar ser atualizada"));
          return false;
        }
  
      } else {
        console.error('9. Error: Respuesta inválida de la API:', response);
        toast.error(i18n.t("Resposta inválida da API ao editar usuário"));
        return false;
      }
  
    } catch (error) {
      console.error('10. Error en la edición:', {
        error,
        errorMessage: error.message,
        errorResponse: error.response?.data
      });
      
      // Mensaje de error más específico basado en el tipo de error
      const errorMessage = error.response?.status === 403 
        ? i18n.t("Você não tem permissão para editar este usuário")
        : i18n.t("Ocorreu um erro ao editar usuário");
      
      toast.error(errorMessage);
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
