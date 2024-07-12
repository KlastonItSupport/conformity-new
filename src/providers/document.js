import { api } from "api/api";
import { AuthContext } from "./auth";
import { handlingMultipleFilesToBase64 } from "helpers/buffer-to-base-64";
import { toast } from "react-toastify";

import { createContext, useContext, useState } from "react";

const DocumentContext = createContext();

const DocumentProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [editSelected, setEditSelected] = useState(null);
  const [pagination, setPagination] = useState(null);

  const handlingFilterParams = (filterParams) => {
    const filters = filterParams;

    const filtersParam = Object.keys(filters)
      .filter((key) => filters[key] !== undefined && filters[key] !== null)
      .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
      .join("&");

    return filtersParam ? `${filtersParam}` : "";
  };

  const getDocuments = async (page = 1, search = "", filterParams = {}) => {
    try {
      const searchParam = search ? `search=${search}` : "";
      const filterParamsParsed = handlingFilterParams(filterParams);

      const response = await api.get(
        `/documents?page=${page}&${searchParam}${filterParamsParsed}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (response.status === 200) {
        setPagination(response.data.pages);

        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao obter documentos");
    }
  };

  const createDocument = async (data) => {
    const files = await handlingMultipleFilesToBase64(data.document);
    data.document = files;
    delete data.project;
    try {
      const response = await api.post("documents", data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 201) {
        toast.success("Documento criado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar documento");
    }
  };

  const deleteDocument = async (id) => {
    try {
      const response = await api.delete(`documents/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 200) {
        toast.success("Documento excluído com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao excluir documento");
      return false;
    }
  };

  const editDocument = async (data) => {
    const files = await handlingMultipleFilesToBase64(data.document);
    data.document = files;
    try {
      const response = await api.patch(`documents/${editSelected.id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 200) {
        toast.success("Documento atualizado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao atualizar documento");
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        createDocument,
        getDocuments,
        documents,
        setDocuments,
        deleteDocument,
        deleteId,
        setDeleteId,
        editSelected,
        setEditSelected,
        editDocument,
        setPagination,
        pagination,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export { DocumentContext, DocumentProvider };
