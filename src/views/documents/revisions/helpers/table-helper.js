import moment from "moment";

export const columns = [
  { header: "Código do documento", access: "documentId" },
  { header: "Nome", access: "documentName" },
  {
    header: "Data",
    access: "revisionDate",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
  { header: "Descrição", access: "description" },
];
