import { api } from "api/api";
import { createContext } from "react";

import { toast } from "react-toastify";
import i18n from "../i18n/index";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const accessTokenKey = "@Conformity:accessToken";
  const userKey = "@Conformity:user";
  const languageKey = "@Conformity:language";

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

  const getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem(userKey));
    if (user) {
      return user;
    }
  };
  const logout = (history) => {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem(languageKey);

    history("/");
  };

  return (
    <AuthContext.Provider
      value={{ signIn, dealingWithAuth, getToken, getUserInfo, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
