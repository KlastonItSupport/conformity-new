import { Container, Text } from "@chakra-ui/react";
import moment from "moment";

export const columns = [
  {
    header: "Departamento",
    access: "department",
  },
  {
    header: "Responsável",
    access: "responsable",
  },
  {
    header: "Objetivo",
    access: "goal",
  },
  {
    header: "Como mede",
    access: "howToMeasure",
  },
  {
    header: "O que mede?",
    access: "whatToMeasure",
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
    header: "Meta",
    access: "meta",
  },
  {
    header: "Prazo",
    access: "deadline",
    formatData: (item) => {
      return moment(item).format("DD/MM/YYYY");
    },
  },
  {
    header: "Status",
    access: "status",
    customCell: (item) => {
      const bgColor = item.status === "Pendente" ? "red.600" : "green.600";
      return (
        <Container padding={"2px"} borderRadius={"5px"} bgColor={bgColor}>
          <Text textAlign={"center"} color={"white"}>
            {item.status}
          </Text>
        </Container>
      );
    },
  },
];

export const mockedData = [
  {
    id: 1,
    department: "Finance",
    responsable: "John Doe",
    goal: "Reduce operational costs by 10%",
    howToMeasure: "Monthly budget reports",
    whatToMeasure: "Total expenses",
    frequency: "Monthly",
    dataType: "Percentage",
    deadline: "2024-12-31",
    status: "Pendente",
  },
  {
    id: 2,
    department: "Marketing",
    responsable: "Jane Smith",
    goal: "Increase brand awareness",
    howToMeasure: "Social media engagement metrics",
    whatToMeasure: "Number of mentions, likes, and shares",
    frequency: "Weekly",
    dataType: "Count",
    deadline: "2024-11-30",
    status: "Concluída",
  },
  {
    id: 3,
    department: "IT",
    responsable: "Michael Johnson",
    goal: "Improve system uptime to 99.9%",
    howToMeasure: "System uptime logs",
    whatToMeasure: "System downtime duration",
    frequency: "Daily",
    dataType: "Percentage",
    deadline: "2024-10-15",
    status: "Concluída",
  },
  {
    id: 4,
    department: "Human Resources",
    responsable: "Emily Davis",
    goal: "Reduce employee turnover by 5%",
    howToMeasure: "Employee retention reports",
    whatToMeasure: "Number of resignations",
    frequency: "Quarterly",
    dataType: "Percentage",
    deadline: "2024-09-30",
    status: "Pendente",
  },
  {
    id: 5,
    department: "Sales",
    responsable: "David Wilson",
    goal: "Increase annual revenue by 15%",
    howToMeasure: "Sales revenue reports",
    whatToMeasure: "Total sales",
    frequency: "Monthly",
    dataType: "Currency",
    deadline: "2024-12-31",
    status: "Concluída",
  },
];
