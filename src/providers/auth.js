import { api } from "api/api";
import { createContext } from "react";

import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const accessTokenKey = "@Conformity:accessToken";
  const userKey = "@Conformity:user";

  const signIn = async (data, history) => {
    try {
      const response = await api.post("/users/signIn", data);

      const { accessToken } = response.data;
      const user = {
        id: response.data.id,
        name: response.data.name,
        email: data.email,
        accessRule: response.data.accessRule,
      };

      localStorage.setItem(accessTokenKey, accessToken);
      localStorage.setItem(userKey, JSON.stringify(user));

      toast.success("Login feito com sucesso");
      history("/users");
    } catch (_) {
      toast.error("Ocorreu um erro");
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

  return (
    <AuthContext.Provider value={{ signIn, dealingWithAuth, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
