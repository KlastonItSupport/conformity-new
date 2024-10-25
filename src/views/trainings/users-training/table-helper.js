import moment from "moment";

export const columns = [
  {
    header: "Treinamento",
    access: "name",
  },
  {
    header: "Validade",
    access: "expirationInMonths",
  },
  {
    header: "Data",
    access: "realizationDate",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
];

export const mockedData = [
  {
    name: "ISO 9001",
    expirationInMonths: "3",
    realizationDate: "2024-07-30",
  },
  {
    name: "IS0 1460",
    expirationInMonths: "12",
    realizationDate: "2024-07-30",
  },
  {
    name: "ISO 27001",
    expirationInMonths: "24",
    realizationDate: "2024-08-15",
  },
  {
    name: "ISO 45001",
    expirationInMonths: "18",
    realizationDate: "2024-09-01",
  },
  {
    name: "ISO 50001",
    expirationInMonths: "6",
    realizationDate: "2024-10-10",
  },
  {
    name: "ISO 14001",
    expirationInMonths: "36",
    realizationDate: "2024-11-05",
  },
  {
    name: "ISO 22000",
    expirationInMonths: "12",
    realizationDate: "2024-12-20",
  },
  {
    name: "ISO 13485",
    expirationInMonths: "48",
    realizationDate: "2025-01-15",
  },
  {
    name: "ISO 31000",
    expirationInMonths: "24",
    realizationDate: "2025-02-10",
  },
  {
    name: "ISO 17025",
    expirationInMonths: "36",
    realizationDate: "2025-03-22",
  },
];
