import { Link, Text, VStack } from "@chakra-ui/react";

const trainings = [
  {
    header: "AUDITOR LIDER NBR ISO 15540",
    access: "trainingName1",
    label: "Validade: 36 meses",
    customCell: (item) => {
      return (
        <Link
          onClick={() => window.open(`/tasks/details?id=${item.id}`, "_blank")}
          color={"primary.100"}
          cursor={"pointer"}
          _hover={{ textDecoration: "underline" }}
        >
          N/A
        </Link>
      );
    },

    customHeader: (column) => {
      return (
        <VStack align={"start"} w="100%">
          <Text display={"flex"} alignItems={"center"}>
            {column.header}
          </Text>
          <Text>{column.label}</Text>
        </VStack>
      );
    },
  },
  {
    header: "VENDAS",
    access: "trainingName2",
    label: "Validade: 36 meses",
    customCell: (item) => {
      return (
        <Link
          onClick={() => window.open(`/tasks/details?id=${item.id}`, "_blank")}
          color={"primary.100"}
          cursor={"pointer"}
          _hover={{ textDecoration: "underline" }}
        >
          N/A
        </Link>
      );
    },
    customHeader: (column) => {
      return (
        <VStack align={"start"} w="100%">
          <Text display={"flex"} alignItems={"center"}>
            {column.header}
          </Text>
          <Text>{column.label}</Text>
        </VStack>
      );
    },
  },
  {
    header: "AUDITOR LIDER ISO 9001",
    access: "trainingName3",
    label: "Validade:  N/A",
    customCell: (item) => {
      return (
        <Link
          onClick={() => window.open(`/tasks/details?id=${item.id}`, "_blank")}
          color={"primary.100"}
          cursor={"pointer"}
          _hover={{ textDecoration: "underline" }}
        >
          N/A
        </Link>
      );
    },
    customHeader: (column) => {
      return (
        <VStack align={"start"} w="100%">
          <Text display={"flex"} alignItems={"center"}>
            {column.header}
          </Text>
          <Text>{column.label}</Text>
        </VStack>
      );
    },
  },
];

export const columns = [
  {
    header: "Funcionários",
    access: "employee",
    customCell: (item) => {
      return <Text fontWeight={"bold"}>{item.employee}</Text>;
    },
  },
  ...trainings,
];

export const mockedData = [
  {
    employee: "Alan Jeronymo",
    trainingName1: "Nome 1",
    trainingName2: "Telefone 1",
    email: "Email 1",
    trainingName3: "Email 1",
  },
  {
    employee: "Gustavo Oliveira",
    trainingName1: "Nome 2",
    trainingName2: "Telefone 2",
    trainingName3: "trainingName3 2",
  },
  {
    employee: "Cristiano Barros",
    trainingName1: "Nome 3",
    trainingName2: "Telefone 3",
    trainingName3: "trainingName3 3",
  },
  {
    employee: "Bruno",
    trainingName1: "Nome 4",
    trainingName2: "Telefone 4",
    trainingName3: "trainingName3 4",
  },
];
