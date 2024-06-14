import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    getDepartaments().then((departamentRes) => {
      setDepartaments(
        departamentRes.map((departament) => {
          return { label: departament.name, value: departament.id };
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
