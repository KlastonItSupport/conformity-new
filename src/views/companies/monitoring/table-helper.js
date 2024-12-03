import moment from "moment";

export const columns = [
  {
    header: "Código",
    access: "id",
  },
  {
    header: "Data",
    access: "createdAt",
    formatData: (data) => moment(data).format("DD/MM/YYYY hh:mm:ss"),
  },
  {
    header: "Usuário",
    access: "userName",
  },
  {
    header: "Módulo",
    access: "module",
  },
  {
    header: "Ação",
    access: "description",
  },
];

export const mockedData = [
  {
    id: "1",
    createdAt: "2021-01-01T00:00:00.000Z",
    userName: "Gustavo Oliveira",
    module: "Monitoramento",
    description: "Criação de relatório",
  },
  {
    id: "2",
    createdAt: "2021-01-02T00:00:00.000Z",
    userName: "Gustavo Oliveira",
    module: "Monitoramento",
    description: "Criação de relatório",
  },
  {
    id: "3",
    createdAt: "2021-01-03T00:00:00.000Z",
    userName: "Gustavo Oliveira",
    module: "Monitoramento",
    description: "Criação de relatório",
  },
  {
    id: "4",
    createdAt: "2021-01-04T00:00:00.000Z",
    userName: "Gustavo Oliveira",
    module: "Monitoramento",
    description: "Criação de relatório",
  },
];
