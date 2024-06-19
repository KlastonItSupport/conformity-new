import { api } from "api/api";
import moment from "moment";
import { toast } from "react-toastify";

// Função para adicionar revisão
export const addRevision = async (
  data,
  userId,
  documentId,
  revisions,
  setRevisions
) => {
  const response = await api.post("/document-revisions", {
    description: data.description,
    revisionDate: moment(data.revisionDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
    userId,
    documentId,
  });
  if (response.status === 201) {
    const updatedRevisions = [response.data, ...revisions];
    toast.success("Revisão adicionada com sucesso");
    setRevisions(updatedRevisions);
  }
};

// Função para obter revisão
export const getRevision = async (id, setRevisions) => {
  const response = await api.get(`/document-revisions/${id}`);
  if (response.status === 200) {
    setRevisions(response.data);
  }
};

// Função para excluir revisão
export const deleteRevision = async (id, revisions, setRevisions) => {
  const response = await api.delete(`/document-revisions/${id}`);
  if (response.status === 200) {
    const updatedRevisions = revisions.filter((revision) => revision.id !== id);
    setRevisions(updatedRevisions);
    toast.success("Revisão excluída com sucesso");
  }
};

// Função para editar revisão
export const editRevision = async (data, edit, revisions, setRevisions) => {
  if (data.revisionDate && data.revisionDate.length === 10) {
    data.revisionDate = moment(data.revisionDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
  }

  const response = await api.patch(`/document-revisions/${edit.id}`, data);
  if (response.status === 200) {
    const updatedRevisions = revisions.map((revision) =>
      revision.id === edit.id ? response.data : revision
    );
    setRevisions(updatedRevisions);
    toast.success("Revisão atualizada com sucesso");
  }
};

// Função para excluir múltiplas revisões
export const deleteMultipleRevisions = async (
  selectedItems,
  revisions,
  setRevisions,
  onMultipleDeleteModalClose
) => {
  const deletePromises = selectedItems.map((selected) =>
    selected.id !== "checkall"
      ? deleteRevision(selected.id, revisions, setRevisions)
      : () => {}
  );

  await Promise.all(deletePromises);

  setRevisions(
    revisions.filter(
      (group) => !selectedItems.some((selected) => selected.id === group.id)
    )
  );

  onMultipleDeleteModalClose();
};

export const columns = [
  { header: "Código", access: "id" },
  { header: "Código Documento", access: "documentId" },
  {
    header: "Dados",
    access: "revisionDate",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
  { header: "Descrição", access: "description" },
  { header: "Usuário", access: "userName" },
];
