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
