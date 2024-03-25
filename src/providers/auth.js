import { api } from "api/api";
import { createContext } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const accessTokenKey = "@Conformity:accessToken";
  const userKey = "@Conformity:user";

  const signIn = (data) => {
    api
      .post("/users/signIn", data)
      .then((response) => {
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
      })
      .catch((_) => {
        toast.error("Aconteceu um erro.");
      });
  };

  return (
    <AuthContext.Provider value={{ signIn }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
