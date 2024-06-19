import { api } from "api/api";
import { toast } from "react-toastify";

export const getEvaluators = async (setEvaluators, documentId) => {
  const response = await api.get(`/evaluators/${documentId}`);
  setEvaluators(response.data);
};

export const createEvaluator = async (
  setEvaluators,
  evaluators,
  documentId,
  data
) => {
  const response = await api.post(`/evaluators`, data);
  setEvaluators([response.data, ...evaluators]);
  toast.success("Avaliador adicionado com sucesso!");
};

export const deleteEvaluator = async (setEvaluators, evaluators, deleteId) => {
  const response = await api.delete(`/evaluators/${deleteId}`);
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

const formatApprovedAndReviewed = (data) =>
  !data || data === 0 ? "-" : "PENDENTE";

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
    formatData: formatApprovedAndReviewed,
  },
  {
    header: "Aprovado?",
    access: "approved",
    formatData: formatApprovedAndReviewed,
  },
  { header: "Editar?", access: "edited", formatData: formatEditAndDelete },
  { header: "Deletar?", access: "deleted", formatData: formatEditAndDelete },
];
