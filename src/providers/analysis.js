import { createContext, useContext, useState } from "react";
import { AuthContext } from "./auth";
import { api } from "api/api";
import { toast } from "react-toastify";

const AnalysisContext = createContext();

const AnalysisProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const [analysisDocuments, setAnalysisDocuments] = useState([]);
  const [pagination, setPagination] = useState(null);

  const getAnalysisDocuments = async (page = 1, search = "") => {
    const response = await api.get(
      `evaluators/user-analaysis/pending?page=${page}&search=${search}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    setPagination(response.data.pages);
    return response.data.items;
  };

  const reviewAnalysisDocuments = async (id) => {
    const response = await api.patch(`evaluators/reviewed/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (response.status === 200) {
      toast.success("Revisão feita com sucesso!");
      const updatedAnalysisDocuments = analysisDocuments.map((document) => {
        if (document.id === id) {
          document.reviewed = 2;
        }
        return document;
      });
      setAnalysisDocuments(updatedAnalysisDocuments);
    }
  };

  const approveAnalysisDocuments = async (id) => {
    const response = await api.patch(`evaluators/approved/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (response.status === 200) {
      toast.success("Aprovação feita com sucesso!");
      const updatedAnalysisDocuments = analysisDocuments.filter((document) => {
        return document.id !== id;
      });
      setAnalysisDocuments(updatedAnalysisDocuments);
    }
  };

  const cancelReviewAnalysisDocuments = async (id, description) => {
    const response = await api.patch(
      `evaluators/cancelled/${id}`,
      { description },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (response.status === 200) {
      toast.success("Cancelamento feito com sucesso!");
      const updatedAnalysisDocuments = analysisDocuments.filter((document) => {
        return document.id !== id;
      });
      setAnalysisDocuments(updatedAnalysisDocuments);
    }
  };

  const approveMultipleAnalysisDocuments = async (ids) => {
    let updatedAnalysisDocuments = [...analysisDocuments]; // Faz uma cópia dos documentos atuais

    for (const analysisDocument of ids) {
      if (analysisDocument.id === "checkall") {
        continue;
      }
      try {
        const response = await api.patch(
          `evaluators/approved/${analysisDocument.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        if (response.status === 200) {
          toast.success("Aprovação feita com sucesso!");

          updatedAnalysisDocuments = updatedAnalysisDocuments.filter(
            (document) => document.id !== analysisDocument.id
          );
        }
      } catch (error) {
        toast.error(`Erro ao aprovar o documento`);
        console.error(
          `Erro ao aprovar o documento ${analysisDocument.id}:`,
          error
        );
      }
    }

    setAnalysisDocuments(updatedAnalysisDocuments);
  };

  const reviewMultipleAnalysisDocuments = async (ids) => {
    for (const analysisDocument of ids) {
      if (analysisDocument.id === "checkall") {
        continue;
      }
      try {
        const response = await api.patch(
          `evaluators/reviewed/${analysisDocument.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        if (response.status === 200) {
          toast.success("Revisão feita com sucesso!");
          const updatedAnalysisDocuments = analysisDocuments.map((document) => {
            if (document.id === analysisDocument.id) {
              document.reviewed = 2;
            }
            return document;
          });
          setAnalysisDocuments(updatedAnalysisDocuments);
        }
      } catch (error) {
        toast.error(`Erro ao revisar o documento`);
      }
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        getAnalysisDocuments,
        analysisDocuments,
        setAnalysisDocuments,
        pagination,
        setPagination,
        reviewAnalysisDocuments,
        approveAnalysisDocuments,
        cancelReviewAnalysisDocuments,
        approveMultipleAnalysisDocuments,
        reviewMultipleAnalysisDocuments,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export { AnalysisContext, AnalysisProvider };
