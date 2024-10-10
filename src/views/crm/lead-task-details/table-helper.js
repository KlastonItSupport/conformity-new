import { Text } from "@chakra-ui/react";
import moment from "moment/moment";
import HtmlParser from "react-html-parser";

export const columns = [
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
  {
    header: "É um lembrete?",
    access: "isReminder",
    formatData: (isReminder, data) => {
      return isReminder ? `Sim (${data.time})` : "Não";
    },
  },
  {
    header: "Foi concluído?",
    access: "completed",
    formatData: (isCompleted, data) => {
      return isCompleted ? "Sim" : "Não";
    },
  },
];
