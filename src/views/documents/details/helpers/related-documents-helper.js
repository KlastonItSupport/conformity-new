import { api } from "api/api";
import { toast } from "react-toastify";

export const columns = [
  { header: "Departamento", access: "departamentName" },
  {
    header: "Categoria",
    access: "categoryName",
  },
  { header: "Autor", access: "owner" },
  { header: "Nome Documento?", access: "name" },
];

export const getRelatedDocuments = async (setRelatedDocuments, documentId) => {
  const response = await api.get(`/document-relateds/${documentId}`);
  setRelatedDocuments(response.data);
};

export const deleteRelatedDocument = async (
  relatedDocumentId,
  setRelatedDocuments,
  relatedDocuments
) => {
  const response = await api.delete(`/document-relateds/${relatedDocumentId}`);
  if (response.status === 200) {
    const filteredRelatedDocuments = relatedDocuments.filter(
      (relatedDocument) => {
        return relatedDocument.id !== relatedDocumentId;
      }
    );

    setRelatedDocuments(filteredRelatedDocuments);
    toast.success("Documento relacionado ");
    return response.data;
  }
};

export const getCompanyDocuments = async (
  setCompanyDocuments,
  companyId,
  token
) => {
  const response = await api.get(`documents?pageSize=1000`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const selects = response.data.items.map((document) => {
    return {
      value: document.id,
      label: document.name,
    };
  });
  setCompanyDocuments(selects);
};

export const createRelatedDocument = async (
  documentId,
  relatedDocumentId,
  setRelatedDocuments,
  relatedDocuments
) => {
  const response = await api.post(`/document-relateds`, {
    mainDocId: documentId,
    relatedDocId: relatedDocumentId,
  });
  if (response.status === 201) {
    setRelatedDocuments([response.data, ...relatedDocuments]);
    toast.success("Documento relacionado");
    return response.data;
  }
};
export const deleteMultiple = async (
  selecteds,
  setRelatedDocuments,
  relatedDocuments
) => {
  const promises = selecteds.map((selected) => {
    if (selected.id !== "checkall") {
      return api.delete(`/document-relateds/${selected.id}`);
    }
    return null;
  });

  const responses = await Promise.all(promises);
  const successfulDeletions = responses.filter(
    (response) => response && response.status === 200
  );

  if (successfulDeletions.length > 0) {
    const filteredRelatedDocuments = relatedDocuments.filter(
      (relatedDocument) =>
        !selecteds.some((selected) => relatedDocument.id === selected.id)
    );

    setRelatedDocuments(filteredRelatedDocuments);
    toast.success(
      `${successfulDeletions.length} documentos relacionados deletados`
    );
  }
};
