import { api } from "api/api";
import { createContext, useEffect, useRef, useState } from "react";
import moment from "moment";

import { toast } from "react-toastify";
import i18n from "../i18n/index";
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
      const response = await api.post("/users/signIn", data);

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
    } catch (_) {
      toast.error(i18n.t("Ocorreu um erro"));
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
    const token = localStorage.getItem(accessTokenKey);
    if (token) {
      return token;
    }
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

      toast.success("Usuário editado com sucesso");
      localStorage.setItem(userKey, JSON.stringify(response.data));

      return true;
    } catch (e) {
      toast.error("Ocorreu um erro.");
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

  const logout = (history) => {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem(languageKey);

    history("/");
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
      console.log("entrei 1");
      return true;
    }

    if (userPermissions) {
      console.log("entrei");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
