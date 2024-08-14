export const columns = [
  {
    header: "Data",
    access: "date",
  },
  {
    header: "Tipo",
    access: "type",
  },
  {
    header: "Validade",
    access: "validity",
  },
  {
    header: "Próxima",
    access: "next",
  },
];

export const mockedData = [
  {
    id: 1,
    date: "14/05/2022",
    type: "Compra",
    validity: "28/05/2022",
    next: "14/05/2022",
  },
  {
    id: 2,
    date: "14/05/2022",
    type: "Manutenção",
    validity: "28/05/2022",
    next: "14/05/2022",
  },
  {
    id: 3,
    date: "14/05/2022",
    type: "Calibração",
    validity: "28/05/2024",
    next: "14/05/2022",
  },
];
