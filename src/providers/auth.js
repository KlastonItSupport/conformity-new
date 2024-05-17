import { api } from "api/api";
import { createContext, useRef, useState } from "react";
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
  const userAccessRule = useRef();

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
        accessRule: response.data.accessRule,
        companyId: response.data.companyId,
      };

      localStorage.setItem(accessTokenKey, accessToken);
      localStorage.setItem(userKey, JSON.stringify(user));
      localStorage.setItem(languageKey, language);

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

      setUser(response.data);
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

    return response.data;
  };

  const getUserAccessRule = async () => {
    const response = await api.get(`/users/access-rule/${user.id}`);
    userAccessRule.current = response.data;
    return response.data;
  };

  const logout = (history) => {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem(languageKey);

    history("/");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
