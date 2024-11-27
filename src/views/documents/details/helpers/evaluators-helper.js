import { api } from "api/api";
import { AUDIT_EVENTS } from "constants/audit-events";
import { toast } from "react-toastify";

export const getEvaluators = async (setEvaluators, documentId) => {
  const response = await api.get(`/evaluators/${documentId}`);
  setEvaluators(response.data);
};

export const createEvaluator = async (
  setEvaluators,
  evaluators,
  data,
  token
) => {
  const response = await api.post(`/evaluators`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-audit-event": AUDIT_EVENTS.DOCUMENTS_DETAILS_ADD_EVALUATOR,
    },
  });
  setEvaluators([response.data, ...evaluators]);
  toast.success("Avaliador adicionado com sucesso!");
};

export const deleteEvaluator = async (
  setEvaluators,
  evaluators,
  deleteId,
  token
) => {
  const response = await api.delete(`/evaluators/${deleteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-audit-event": AUDIT_EVENTS.DOCUMENTS_DETAILS_DELETE_EVALUATOR,
    },
  });
  if (response.status === 200) {
    const newEvaluators = evaluators.filter((item) => item.id !== deleteId);
    setEvaluators(newEvaluators);
    toast.success("Avaliador excluído com sucesso!");
  }
};

export const deleteMultipleEvaluators = async (
  selectedItems,
  evaluators,
  setEvaluators,
  onMultipleDeleteModalClose,
  setLoading
) => {
  setLoading(true);
  const deletePromises = selectedItems.map((selected) =>
    selected.id !== "checkall"
      ? deleteEvaluator(setEvaluators, evaluators, selected.id)
      : () => {}
  );

  await Promise.all(deletePromises);

  setEvaluators(
    evaluators.filter(
      (group) => !selectedItems.some((selected) => selected.id === group.id)
    )
  );

  setLoading(false);
  onMultipleDeleteModalClose();
};

const formatApproved = (data, item) => {
  if (item.cancelled) return "CANCELADO";
  if (data === 0 || !data) return "-";
  if (data === 1) return "PENDENTE";
  if (data === 2) return "APROVADO";
  if (data === 3) return "CANCELADO";
  if (data) return "PENDENTE";
};

const formatReviewed = (data, item) => {
  if (item.cancelled) return "CANCELADO";
  if (data === 0 || !data) return "-";
  if (data === 1) return "PENDENTE";
  if (data === 2) return "REVISADO";
  if (data === 3) return "CANCELADO";
  if (data) return "PENDENTE";
};

const formatEditAndDelete = (data) => (data ? "SIM" : "NÃO");

export const columns = [
  { header: "Nome", access: "userName" },
  {
    header: "Descrição do cancelamento",
    access: "cancelDescription",
  },
  {
    header: "Revisado",
    access: "reviewed",
    formatData: formatReviewed,
  },
  {
    header: "Aprovado?",
    access: "approved",
    formatData: formatApproved,
  },
  { header: "Editar?", access: "edited", formatData: formatEditAndDelete },
  { header: "Deletar?", access: "deleted", formatData: formatEditAndDelete },
];
