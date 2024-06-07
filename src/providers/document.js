import { api } from "api/api";
import { AuthContext } from "./auth";
import { handlingMultipleFilesToBase64 } from "helpers/buffer-to-base-64";
import { toast } from "react-toastify";

const { createContext, useContext } = require("react");

const DocumentContext = createContext();

const DocumentProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);

  const createDocument = async (data) => {
    const files = await handlingMultipleFilesToBase64(data.document);
    data.document = files;
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

  return (
    <DocumentContext.Provider
      value={{
        createDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export { DocumentContext, DocumentProvider };
