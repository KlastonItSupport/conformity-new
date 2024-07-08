import moment from "moment";

export const columns = [
  {
    header: "Frequência",
    access: "frequency",
  },
  {
    header: "Status",
    access: "status",
  },
  {
    header: "Data de término",
    access: "dataEnd",
    formatData: (data) => moment.utc(data).format("DD/MM/YYYY"),
  },
  {
    header: "Hora",
    access: "hour",
  },
];
