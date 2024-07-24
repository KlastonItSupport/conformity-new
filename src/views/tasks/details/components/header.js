import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Header = ({
  code,
  author,
  project,
  origin,
  classification,
  type,
  datePrevision,
  status,
  onAction,
}) => {
  let bgColor;

  if (status === "Aberta") {
    bgColor = "primary.100";
  } else if (status === "Fechada") {
    bgColor = "green.500";
  } else {
    bgColor = "red.600";
  }

  const statusBox = (
    <Box bgColor={bgColor} p={"10px 25px"} borderRadius={"5px"}>
      <Text fontSize={"16px"} fontWeight={"semibold"} color={"white"}>
        {status}
      </Text>
    </Box>
  );

  const label = (title, value) => (
    <HStack
      borderRadius={"5px"}
      justifyContent={"space-between"}
      w={"100%"}
      borderBottom={"1px solid #ddd"}
      p={"2px 0px"}
    >
      <Text fontSize={"16px"} fontWeight={"semibold"}>
        {title}:
      </Text>
      <Text fontSize={"16px"}>{value}</Text>
    </HStack>
  );

  const actionButton = (
    <ButtonPrimary
      fontSize="sm"
      fontWeight="bold"
      bgColor={status === "Fechada" ? "red.600" : "primary.100"}
      textColor={"white"}
      boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
      borderRadius="7px"
      _hover={{ bgColor: status === "Fechada" ? "red.700" : "primary.200" }}
      label={status === "Aberta" ? "Fechar tarefa" : "Reabrir tarefa"}
      padding={"5px"}
      w={"100%"}
      h="40px"
      type="submit"
      margin={"30px 0 10px 0px !important"}
    />
  );
  const percentage = 40;

  return (
    <VStack
      alignItems={"start"}
      bgColor={"white"}
      border={"1px solid #ddd"}
      p={"20px"}
    >
      <HStack justify={"space-between"} w={"100%"}>
        <Text fontSize={"20px"} color={"header.100"}>
          TASK CÓDIGO: #{code}
        </Text>
        <HStack>
          <Box w={"60px"} h={"60px"} mr={"20px"}>
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                pathColor: "#0086FF",
                textColor: "#0086FF",
              })}
            />
          </Box>
          {statusBox}
        </HStack>
      </HStack>
      {label("Autor", author)}
      {label("Projeto", project)}
      {label("Origem", origin)}
      {label("Classificação", classification)}
      {label("Tipo", type)}
      {label("Data Previsão", datePrevision)}
      {status !== "Reaberta" && actionButton}
    </VStack>
  );
};

export default Header;
