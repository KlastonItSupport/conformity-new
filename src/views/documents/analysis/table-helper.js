const formatApproved = (data) => {
  if (data === 0 || !data) return "-";
  if (data === 1) return "PENDENTE";
  if (data === 2) return "APROVADO";
};

const formatReviewed = (data) => {
  if (data === 0 || !data) return "-";
  if (data === 1) return "PENDENTE";
  if (data === 2) return "REVISADO";
};

export const columns = [
  { header: "Nome", access: "documentName" },
  { header: "Responsável", access: "responsibleName" },
  { header: "Revisado?", access: "reviewed", formatData: formatReviewed },
  { header: "Aprovado?", access: "approved", formatData: formatApproved },
];
