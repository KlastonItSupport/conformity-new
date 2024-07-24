import moment from "moment";

export const columns = [
  {
    header: "Código",
    access: "id",
  },
  {
    header: "Responsável",
    access: "responsable",
  },
  {
    header: "Por que?",
    access: "why",
  },
  {
    header: "Resposta?",
    access: "answer",
  },
  {
    header: "Data",
    access: "date",
    formatData: (data) => moment.utc(data).format("DD/MM/YYYY"),
  },
];
