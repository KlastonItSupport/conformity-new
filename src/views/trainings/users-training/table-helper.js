import moment from "moment";

export const columns = [
  {
    header: "Treinamento",
    access: "trainingName",
  },
  {
    header: "Validade",
    access: "expirationInMonths",
  },
  {
    header: "Data",
    access: "date",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
];
