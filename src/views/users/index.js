import { AuthContext } from "providers/auth";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UsersPage = () => {
  const { dealingWithAuth } = useContext(AuthContext);
  const history = useNavigate();

  useEffect(() => {
    dealingWithAuth(true, "/users", history);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return "USUARIOS";
};
