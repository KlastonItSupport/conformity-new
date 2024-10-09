import { Text } from "@chakra-ui/react";
import moment from "moment";
import HtmlParser from "react-html-parser";

export const columns = [
  {
    header: "Usuário",
    access: "username",
  },
  {
    header: "Cliente / Fornecedor",
    access: "crmCompanyName",
  },
  {
    header: "Status",
    access: "status",
  },
  {
    header: "Valor",
    access: "value",
  },
  {
    header: "Email",
    access: "email",
  },
  {
    header: "Telefone",
    access: "celphone",
  },
  {
    header: "Descrição",
    access: "description",
    formatData: (data) => {
      return <Text>{HtmlParser(data)}</Text>;
    },
  },
  {
    header: "Última atualização",
    access: "updatedAt",
    formatData: (data) =>
      data ? moment(data).format("DD/MM/YYYY HH:mm") : "Não houve atualizações",
  },
];

export const tasksColumns = [
  {
    header: "Cliente / Fornecedor",
    access: "clientName",
  },
  {
    header: "Data",
    access: "date",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
  {
    header: "Tipo",
    access: "type",
  },
  {
    header: "Usuário",
    access: "userName",
  },
  {
    header: "Descrição",
    access: "description",
    formatData: (data) => {
      return <Text>{HtmlParser(data)}</Text>;
    },
  },
];
