import { Link, Text } from "@chakra-ui/react";
import moment from "moment";

export const columns = [
  {
    header: "Indicador",
    access: "indicator",
  },
  {
    header: "Data",
    access: "date",
    formatData: (item) => {
      return moment(item).format("DD/MM/YYYY");
    },
  },
  {
    header: "Meta",
    access: "goal",
  },
  {
    header: "Resposta",
    access: "answer",
  },
  {
    header: "Justificativa",
    access: "reason",
  },
  {
    header: "Frequência",
    access: "frequency",
  },
  {
    header: "Tipo de dado",
    access: "dataType",
  },
  {
    header: "Tasks",
    access: "tasks",
    customCell: (item) => {
      return item.tasks.map((task) => {
        return (
          <Link
            onClick={() => window.open(`/tasks/details?id=${task}`, "_blank")}
            color={"primary.100"}
            cursor={"pointer"}
            _hover={{ textDecoration: "underline" }}
          >
            {task},{" "}
          </Link>
        );
      });
    },
  },
];

export const mockedData = [
  {
    id: 1,
    indicator: "Indicador 1",
    date: "2023-01-01",
    answer: "Resposta 1",
    reason: "Justificativa 1",
    frequency: "Semanal",
    dataType: "Percentage",
    goal: "100%",
    tasks: [
      2435, 1234, 1123, 1234, 1234, 1234, 1234, 1234, 1234, 1234, 1234, 1234,
    ],
  },
  {
    id: 2,
    indicator: "Indicador 2",
    date: "2023-02-01",
    answer: "Resposta 2",
    reason: "Justificativa 2",
    frequency: "Mensal",
    goal: "100%",
    dataType: "Number",
    tasks: [33, 2234, 12642],
  },
  {
    id: 3,
    indicator: "Indicador 3",
    date: "2023-03-01",
    answer: "Resposta 3",
    reason: "Justificativa 3",
    frequency: "Diária",
    goal: "100%",
    dataType: "Text",
    tasks: [],
  },
  {
    id: 4,
    indicator: "Indicador 4",
    date: "2023-04-01",
    answer: "Resposta 4",
    reason: "Justificativa 4",
    frequency: "Anual",
    goal: "100%",
    dataType: "Currency",
    tasks: [],
  },
];
