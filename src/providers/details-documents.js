import { useContext, createContext, useState } from "react";
import { AuthContext } from "./auth";
import { api } from "api/api";
import { toast } from "react-toastify";

const DetailsDocumentsContext = createContext();

const DetailsDocumentsProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const [documentsDetails, setDocumentsDetails] = useState();
  const [additionalDocuments, setAdditionalDocuments] = useState([]);
  //   const location = useLocation();

  const getDocumentDetails = async (id) => {
    try {
      const response = await api.get(`documents/document-details/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 200) {
        setDocumentsDetails(response.data);
        setAdditionalDocuments(response.data.additionalDocuments);
        return response.data;
      }
    } catch (error) {}
  };
  const deleteAdditionalDocument = async (id) => {
    try {
      const response = await api.delete(
        `documents/additional-documents/${id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (response.status === 200) {
        toast.success("Documento excluído com sucesso");
        setAdditionalDocuments(
          additionalDocuments.filter((document) => document.id !== id)
        );
      }
    } catch (error) {}
  };

  const createAdditionalDocument = async (data) => {
    try {
      const response = await api.post(`documents/additional-documents`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 201) {
        toast.success("Documento adicionado com sucesso");
        setAdditionalDocuments([...additionalDocuments, ...response.data]);
      }
    } catch (error) {}
  };

  return (
    <DetailsDocumentsContext.Provider
      value={{
        getDocumentDetails,
        documentsDetails,
        additionalDocuments,
        deleteAdditionalDocument,
        createAdditionalDocument,
      }}
    >
      {children}
    </DetailsDocumentsContext.Provider>
  );
};

export { DetailsDocumentsContext, DetailsDocumentsProvider };
