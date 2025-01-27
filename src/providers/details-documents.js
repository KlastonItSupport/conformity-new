import { useContext, createContext, useState } from "react";
import { AuthContext } from "./auth";
import { api } from "api/api";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const DetailsDocumentsContext = createContext();

const DetailsDocumentsProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const [documentsDetails, setDocumentsDetails] = useState();
  const [additionalDocuments, setAdditionalDocuments] = useState([]);
  const [description, setDescription] = useState("");
  //   const location = useLocation();

const checkPermissionToDetailsDocuments = async (id) => {
    try {
      console.log('Checking permissions for document:', id);
      console.log('Token:', getToken());
  
      const response = await api.get(`/documents/permission/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      
      console.log('Permission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking permissions:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        config: error.config,
      });
      return { isAllowed: false, message: error.response?.data?.message || 'Error checking permissions' };
    }
  };

  const getDocumentDetails = async (id) => {
    try {
      const response = await api.get(`documents/document-details/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.DOCUMENTS_DETAILS_GET,
        },
      });
      if (response.status === 200) {
        setDocumentsDetails(response.data);
        setAdditionalDocuments(response.data.additionalDocuments);
        setDescription(response.data.document.description);
        return response.data;
      }
    } catch (error) {}
  };
  const deleteAdditionalDocument = async (id) => {
    try {
      const response = await api.delete(
        `documents/additional-documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-audit-event":
              AUDIT_EVENTS.DOCUMENTS_DETAILS_DELETE_ADDITIONAL_DOCUMENT,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Documento excluído com sucxxesso");
        setAdditionalDocuments(
          additionalDocuments.filter((document) => document.id !== id)
        );
      }
    } catch (error) {}
  };

  const createAdditionalDocument = async (data) => {
    try {
      const response = await api.post(`documents/additional-documents`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event":
            AUDIT_EVENTS.DOCUMENTS_DETAILS_ADD_ADDITIONAL_DOCUMENT,
        },
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
        description,
        setDescription,
        checkPermissionToDetailsDocuments,
      }}
    >
      {children}
    </DetailsDocumentsContext.Provider>
  );
};

export { DetailsDocumentsContext, DetailsDocumentsProvider };
