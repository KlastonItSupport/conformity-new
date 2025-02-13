import { api } from "api/api";
import { createContext, useState } from "react";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import i18n from "../i18n/index";
import { AUDIT_EVENTS } from "constants/audit-events";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const accessTokenKey = "@Conformity:accessToken";
  const userKey = "@Conformity:user";
  const languageKey = "@Conformity:language";
  const [user, setUser] = useState(getUserInfo());
  const [permissions, setPermissions] = useState();
  const [userAccessRule, setUserAccessRule] = useState();
  const [userPermissions, setUserPermissions] = useState();

  const signIn = async (data, history) => {
    try {
      const language = data.language;
      delete data.language;
      const response = await api.post("/users/signIn", data, {
        headers: { "x-audit-event": AUDIT_EVENTS.USER_SIGNED_IN },
      });

      const { accessToken } = response.data;
      const user = {
        id: response.data.id,
        name: response.data.name,
        email: data.email,
        celphone: response.data.celphone,
        profilePic: response.data.profilePic,
        birthDate: response.data.birthDate,
        birthday: response.data.birthDate,
        accessRule: response.data.accessRule,
        companyId: response.data.companyId,
        companyName: response.data.companyName,
      };

      localStorage.setItem(accessTokenKey, accessToken);
      localStorage.setItem(userKey, JSON.stringify(user));
      localStorage.setItem(languageKey, language);

      setUser(user);
      i18n.changeLanguage(language);
      toast.success(i18n.t("Login feito com sucesso"));
      history("/users");
    } catch (error) {
      toast.error(i18n.t("Ocorreu um erro"));
      throw error;
    }
  };

  const dealingWithAuth = (shouldRedirect, redirectRoute, history) => {
    const hasAccessToken = localStorage.getItem(accessTokenKey);
    const hasUser = localStorage.getItem(userKey);

    if (hasAccessToken && hasUser) {
      if (shouldRedirect) {
        history(redirectRoute);
      }
      return;
    }
    history("/signin");
  };

  const isAuthenticated = () => {
    const hasAccessToken = localStorage.getItem(accessTokenKey);
    const hasUser = localStorage.getItem(userKey);
    return hasAccessToken && hasUser;
  };

  const getToken = () => {
    return localStorage.getItem(accessTokenKey);
  };

  function getUserInfo() {
    const user = JSON.parse(localStorage.getItem(userKey));
    if (user) {
      return user;
    }
  }

  const editProfile = async (data) => {
    if (data.profilePic) {
      data.profilePic = data.profilePic.toString();
    }
    try {
      const response = await api.patch(`/users/${user.id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setUser({ ...response.data, birthDate: data.birthday });
      moment(response.data.profilePic).format("DD/MM/YYYY");

      toast.success(i18n.t("Usuário editado com sucesso"));
      localStorage.setItem(userKey, JSON.stringify(response.data));

      return true;
    } catch (error) {
      toast.error(i18n.t("Ocorreu um erro"));
      return false;
    }
  };

  const getUserPermission = async () => {
    const response = await api.get(
      `/permissions/get-user-permissions/${user.id}`
    );

    setUserPermissions(response.data);
    return response.data;
  };

  const getUserAccessRule = async () => {
    const response = await api.get(`/users/access-rule/${user.id}`);
    setUserAccessRule(response.data);
    return response.data;
  };

  const logout = async (history) => {
    try {
      // Limpiar localStorage
      localStorage.removeItem(accessTokenKey);
      localStorage.removeItem(userKey);
      localStorage.removeItem(languageKey);
      
      // Limpiar estados
      setUser(null);
      setPermissions(null);
      setUserAccessRule(null);
      setUserPermissions(null);
      
      // Limpiar headers de axios
      delete api.defaults.headers.common['Authorization'];
      
      // Cancelar peticiones pendientes
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      api.defaults.cancelToken = source.token;
      source.cancel('User logged out');
      
      // Redireccionar
      history("/signin");
      
      // Forzar recarga para limpiar cache
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/signin';
    }
  };

  const checkPermissionForAction = (module, action) => {
    if (!userAccessRule) return false;
    if (userAccessRule?.isAdmin || userAccessRule?.isSuperUser) {
      return true;
    }

    if (userPermissions) {
      const permission = userPermissions[module][action];
      return permission;
    }
    return false;
  };

  const hasPermissionToAccessThisPage = async (moduleName) => {
    if (!userAccessRule) {
      const accessRule = await getUserAccessRule();
      setUserAccessRule(accessRule);
      if (!userAccessRule) return false;
    }
    if (userAccessRule?.isAdmin || userAccessRule?.isSuperUser) {
      return true;
    }

    if (userPermissions) {
      const isAllowed = userPermissions[moduleName]["canRead"];
      return isAllowed;
    }
    return false;
  };

  const dispatchAuditEvent = (event) => {
    api.get("audit", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": event,
      },
    });
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      console.log(response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al enviar email');
      }
      
      toast.success(i18n.t("Email de recuperación enviado"));
      return true;
    } catch (error) {
      toast.error(i18n.t("Error al enviar email de recuperación"));
      throw new Error(
        error.response?.data?.message || 
        'Error de conexión. Intente nuevamente.'
      );
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      }, {
        headers: {
          'x-audit-event': AUDIT_EVENTS.PASSWORD_RESET_SUCCESS
        }
      });

      if (!response.data.success) {
        throw new Error('Error al actualizar contraseña');
      }

      toast.success(i18n.t("Contraseña actualizada exitosamente"));
      return true;
    } catch (error) {
      toast.error(i18n.t("Error al actualizar contraseña"));
      throw new Error(
        error.response?.data?.message || 
        'Error al actualizar contraseña. Token inválido o expirado.'
      );
    }
  };

  const changePassword = async (data) => {
    try {
      const response = await api.post('/users/change-password', {
        token: data.token,
        id: data.id,
        newPassword: data.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'x-audit-event': AUDIT_EVENTS.PASSWORD_CHANGED
        }
      });

      toast.success(i18n.t('Senha alterada com sucesso!'));
      return response.data;
    } catch (error) {
      toast.error(i18n.t(error.response?.data?.message || 'Erro ao alterar senha'));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        dealingWithAuth,
        getToken,
        getUserInfo,
        logout,
        editProfile,
        user,
        setUser,
        getUserPermission,
        permissions,
        setPermissions,
        getUserAccessRule,
        userAccessRule,
        userPermissions,
        setUserPermissions,
        checkPermissionForAction,
        isAuthenticated,
        hasPermissionToAccessThisPage,
        dispatchAuditEvent,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };