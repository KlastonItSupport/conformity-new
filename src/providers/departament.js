import { api } from "api/api";
import { AuthContext } from "./auth";

const { createContext, useContext, useState, useEffect } = require("react");

const DepartamentContext = createContext();

const DepartamentProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [createDepartamentIsLoading, setCreateDepartamentIsLoading] =
    useState(false);
  const [departaments, setDepartaments] = useState([]);

  const createDepartament = async (data) => {
    const userInfo = getUserInfo();
    const response = await api.post(
      "departaments",
      { ...data, companyId: userInfo.companyId },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    setDepartaments([
      ...departaments,
      { label: response.data.name, value: response.data.id },
    ]);
    return response.data;
  };

  const getDepartaments = async () => {
    const response = await api.get("departaments", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  };

  return (
    <DepartamentContext.Provider
      value={{
        createDepartament,
        getDepartaments,
        createDepartamentIsLoading,
        setCreateDepartamentIsLoading,
        departaments,
        setDepartaments,
      }}
    >
      {children}
    </DepartamentContext.Provider>
  );
};

export { DepartamentContext, DepartamentProvider };
