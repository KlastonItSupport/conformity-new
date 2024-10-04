import moment from "moment";

export const columns = [
  {
    header: "Titulo",
    access: "title",
  },
  {
    header: "Cliente / Fornecedor",
    access: "clientSupplier",
  },
  {
    header: "Data de Início",
    access: "initialDate",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
  {
    header: "Data de Término",
    access: "endDate",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
  {
    header: "Valor",
    access: "value",
  },
  {
    header: "Detalhes",
    access: "details",
  },
  {
    header: "Status",
    access: "status",
  },
];
