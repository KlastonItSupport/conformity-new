import { api } from "api/api";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { AuthContext } from "./auth";
import i18n from "../i18n/index";

const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const itemsPerPage = 10;
  const [deleteId, setDeleteId] = useState();
  const [editId, setEditId] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState([]);
  const [companiesCopy, setCompaniesCopy] = useState([]);
  const [users, setUsers] = useState([]);
  const editFormRef = useRef(null);

  const changeDeleteId = (id) => {
    setDeleteId(id);
  };

  const changeEditId = (id) => {
    setDeleteId(id);
  };

  const changeCompanies = (companies) => setCompanies([...companies]);

  const addCompany = async (data) => {
    try {
      const response = await api.post("companies", data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setCompanies([response.data, ...companies]);
      setCompaniesCopy([response.data, ...companiesCopy]);
      setCurrentPage(1);
      toast.success(i18n.t("Empresa Criada com sucesso"));

      return true;
    } catch (e) {
      if ((e.statusCode = 409)) {
        toast.error(i18n.t("Já existe uma empresa com este email"));
        return false;
      }
      toast.error(i18n.t("Ocorreu um erro"));
      return false;
    }
  };

  const getCompanies = async () => {
    try {
      const response = await api.get("companies", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setCompanies(response.data);
      setCompaniesCopy(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const updatePagination = (page) => {
    if (companies.length > 0) {
      const firstPostIndex = (page - 1) * itemsPerPage;
      const lastItemIndex = firstPostIndex + itemsPerPage;
      const slicedData = companiesCopy.slice(firstPostIndex, lastItemIndex);
      setCompanies([...slicedData]);
      setCurrentPage(page);
    }
  };

  const getCompanyUsers = async () => {
    const response = await api.get("/companies/get-users", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setUsers(response.data);
  };

  useEffect(() => {
    updatePagination(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companiesCopy]);

  return (
    <CompanyContext.Provider
      value={{
        deleteId,
        changeDeleteId,
        editId,
        changeEditId,
        changeCompanies,
        editFormRef,
        addCompany,
        getCompanies,
        updatePagination,
        itemsPerPage,
        companies,
        companiesCopy,
        currentPage,
        getCompanyUsers,
        users,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export { CompanyContext, CompanyProvider };
