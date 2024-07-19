import moment from "moment";

export const columns = [
  { header: "Código", access: "id" },
  { header: "Autor", access: "responsable" },
  { header: "Título", access: "title" },
  { header: "Origem", access: "origin" },
  { header: "Classificação", access: "classification" },
  { header: "Tipo", access: "type" },
  {
    header: "Aberto",
    access: "createdAt",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
  { header: "Status", access: "status" },
];
