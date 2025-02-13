import { api } from "api/api";
import { createContext, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";

import { AuthContext } from "./auth";
import i18n from "../i18n/index";
import { AUDIT_EVENTS } from "constants/audit-events";

const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const itemsPerPage = 10;
  const [deleteId, setDeleteId] = useState();
  const [editId, setEditId] = useState(0);
  const [editCompanyIsLoading, setEditCompanyIsLoading] = useState(false);
  const [createCompanyIsLoading, setCreateCompanyIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);

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
      setCreateCompanyIsLoading(true);
      const response = await api.post("companies", data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_CREATED,
        },
      });

      setCompanies([response.data, ...companies]);
      toast.success(i18n.t("Empresa Criada com sucesso"));

      return true;
    } catch (e) {
      if ((e.statusCode = 409)) {
        toast.error(i18n.t("Já existe uma empresa com este email"));
        setCreateCompanyIsLoading(false);
        return false;
      }
      toast.error(i18n.t("Ocorreu um erro"));
      setCreateCompanyIsLoading(false);
      return false;
    }
  };

  const getCompanies = async (page = 1, search = "", limit = 10) => {
    const response = await api.get(
      `/companies?page=${page}&search=${search}&pageSize=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    setCompanies(response.data.items);
    setPagination(response.data.pages);
    return response.data.items;
  };

  const editCompany = async (id, data) => {
    try {
      setEditCompanyIsLoading(true);
      const response = await api.patch(`companies/${id}`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.COMPANY_UPDATED,
        },
      });

      const editedCompanyIndex = companies.findIndex(
        (user) => user.id === response.data.id
      );

      const updatedCompanies = [...companies];

      updatedCompanies[editedCompanyIndex] = response.data;

      setCompanies(updatedCompanies);
      toast.success(i18n.t("Empresa Editada com sucesso"));
      setEditCompanyIsLoading(false);

      return true;
    } catch (e) {
      if ((e.statusCode = 409)) {
        toast.error(i18n.t("Já existe uma empresa com este email"));
        setEditCompanyIsLoading(false);
        return false;
      }
      toast.error(i18n.t("Ocorreu um erro"));
      setEditCompanyIsLoading(false);

      return false;
    }
  };

  const getCompanyUsers = async (shouldSetUsers = true) => {
    const response = await api.get("/companies/get-users", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (shouldSetUsers) {
      setUsers(response.data);
    }
    return response.data;
  };

  return (
    <CompanyContext.Provider
      value={{
        deleteId,
        changeDeleteId,
        editId,
        setEditId,
        changeEditId,
        changeCompanies,
        editFormRef,
        addCompany,
        getCompanies,
        itemsPerPage,
        companies,
        getCompanyUsers,
        users,
        pagination,
        editCompany,
        editCompanyIsLoading,
        createCompanyIsLoading,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export { CompanyContext, CompanyProvider };
