import { Box, HStack, Progress, Text } from "@chakra-ui/react";
import moment from "moment";

export const columns = [
  {
    header: "Titulo",
    access: "title",
  },
  {
    header: "Cliente",
    access: "clientName",
  },
  {
    header: "Status",
    access: "status",
  },
  {
    header: "Data de início",
    access: "startDate",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
  {
    header: "Data para finalização",
    access: "endDate",
    formatData: (data) => moment(data).format("DD/MM/YYYY"),
  },
  {
    header: "Progresso",
    access: "progress",
    customCell: (data) => {
      console.log(data.progress);
      return (
        <HStack alignItems={"center"}>
          <Box position="relative" width={"100%"}>
            <Progress
              value={Number(data.progress)}
              size="md"
              color={"red"}
              bgColor={"white"}
              border={"3px solid #ddd"}
              width={"100%"}
              height={"20px"}
              sx={{
                "& > div:first-of-type": {
                  backgroundColor: data.progress > 60 ? "#74C374" : null,
                },
              }}
            />
            <Text
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              color="black"
              fontSize="sm"
              fontWeight="bold"
            >
              {data.progress}%
            </Text>
          </Box>
        </HStack>
      );
    },
  },
];

export const mockedData = [
  {
    id: 1,
    title: "Projeto Alpha",
    clientName: "Martins Silva - ME",
    status: "Ativo",
    startDate: "2023-01-10",
    endDate: "2023-02-10",
    progress: "100",
  },
  {
    id: 2,
    title: "Projeto Beta",
    clientName: "Pereira e Filhos LTDA",
    status: "Em Progresso",
    startDate: "2023-03-01",
    endDate: "2023-04-01",
    progress: "75",
  },
  {
    id: 3,
    title: "Projeto Gama",
    clientName: "Oliveira - ME",
    status: "Pendente",
    startDate: "2023-05-05",
    endDate: "2023-06-05",
    progress: "45",
  },
  {
    id: 4,
    title: "Projeto Delta",
    clientName: "Fernandes - EI",
    status: "Concluído",
    startDate: "2022-11-15",
    endDate: "2022-12-15",
    progress: "100",
  },
  {
    id: 5,
    title: "Projeto Épsilon",
    clientName: "Gomes e Associados",
    status: "Cancelado",
    startDate: "2023-07-01",
    endDate: "2023-07-20",
    progress: "0",
  },
  {
    id: 6,
    title: "Projeto Zeta",
    clientName: "Silva Rocha LTDA",
    status: "Ativo",
    startDate: "2023-08-15",
    endDate: "2023-09-15",
    progress: "60",
  },
  {
    id: 7,
    title: "Projeto Eta",
    clientName: "Alves - ME",
    status: "Em Progresso",
    startDate: "2023-09-01",
    endDate: "2023-10-01",
    progress: "30",
  },
  {
    id: 8,
    title: "Projeto Theta",
    clientName: "Souza e Cia",
    status: "Pendente",
    startDate: "2023-05-20",
    endDate: "2023-06-20",
    progress: "10",
  },
  {
    id: 9,
    title: "Projeto Iota",
    clientName: "Costa LTDA",
    status: "Concluído",
    startDate: "2023-04-10",
    endDate: "2023-05-10",
    progress: "100",
  },
  {
    id: 10,
    title: "Projeto Kappa",
    clientName: "Cardoso e Associados",
    status: "Ativo",
    startDate: "2023-06-01",
    endDate: "2023-07-01",
    progress: "80",
  },
];
