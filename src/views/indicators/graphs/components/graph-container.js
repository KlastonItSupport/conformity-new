import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { defaults } from "chart.js/auto";
import { useBreakpoint } from "hooks/usebreakpoint";
import moment from "moment";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const GraphContainer = ({
  department,
  dataType,
  frequency,
  indicatorsAnswers,
}) => {
  const { isMobile } = useBreakpoint();

  const [selectedGraph, setSelectedGraph] = useState("lines");

  const buttonGraph = (title, value, onClick) => {
    const isSelected = selectedGraph === value;
    return (
      <Button
        borderRadius={"5px"}
        px={"15px"}
        colorScheme="blue"
        bgColor={isSelected ? "#0075df" : "#ddd"}
        textColor={isSelected ? "white" : "black"}
        fontWeight={"normal"}
        _hover={{ bgColor: "#ddd" }}
        onClick={() => onClick(value)}
        w={isMobile ? "100%" : "auto"}
      >
        {title}
      </Button>
    );
  };

  const onClickGraphSelect = (value) => {
    setSelectedGraph(value);
  };

  const graphData = {
    labels: indicatorsAnswers.map((answer) =>
      moment(answer.date).format("DD/MM/YYYY")
    ),
    datasets: [
      {
        label: "Planejado",
        data: indicatorsAnswers.map((answer) => answer.goal),
        backgroundColor: "#064FF0",
        borderColor: "#064FF0",
      },
      {
        label: "Realizado",
        data: indicatorsAnswers.map((answer) => answer.answer),

        backgroundColor: "#FF3030",
        borderColor: "#FF3030",
      },
    ],
  };

  return (
    <VStack
      bgColor={"white"}
      p={"10px 20px"}
      w={"95%"}
      align={"start"}
      border={"1px solid #ddd "}
      borderRadius={"8px"}
    >
      <Text color={"header.100"} fontSize={"xl"}>
        Departamento: {department} - Tipo de dado: {dataType} - Frequência:{" "}
        {frequency}
      </Text>
      <Divider borderColor={"#ddd"} w={"100%"} borderWidth={"1px"} />
      {isMobile ? (
        <VStack spacing={4} w="100%">
          {buttonGraph("Gráfico de linhas", "lines", onClickGraphSelect)}
          {buttonGraph("Gráfico de barras", "bars", onClickGraphSelect)}
          {buttonGraph(
            "Gráfico de barras [ Horizontal ]",
            "horizontal",
            onClickGraphSelect
          )}
          {buttonGraph("Gráfico de pizza", "pie", onClickGraphSelect)}{" "}
        </VStack>
      ) : (
        <HStack spacing={4}>
          {buttonGraph("Gráfico de linhas", "lines", onClickGraphSelect)}
          {buttonGraph("Gráfico de barras", "bars", onClickGraphSelect)}
          {buttonGraph(
            "Gráfico de barras [ Horizontal ]",
            "horizontal",
            onClickGraphSelect
          )}
          {buttonGraph("Gráfico de pizza", "pie", onClickGraphSelect)}{" "}
        </HStack>
      )}

      {selectedGraph === "lines" && (
        <Box w={"100%"} minH={"100%"} h={{ lg: "520px", sm: "500px" }}>
          <Line
            data={graphData}
            options={{
              elements: {
                line: {
                  tension: 0.5,
                },
              },
              plugins: {
                title: {
                  text: "Monthly Revenue & Cost",
                },
              },
            }}
          />
        </Box>
      )}

      {selectedGraph === "bars" && (
        <Box w={"100%"} minH={"100%"} h={{ lg: "520px", sm: "500px" }}>
          <Bar
            data={graphData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Monthly Revenue & Cost",
                },
              },
            }}
          />
        </Box>
      )}

      {selectedGraph === "horizontal" && (
        <Box w={"100%"} minH={"100%"} h={{ lg: "520px", sm: "500px" }}>
          <Bar
            data={graphData}
            options={{
              indexAxis: "y",
              plugins: {
                title: {
                  display: true,
                  text: "Monthly Revenue & Cost (Horizontal)",
                },
              },
            }}
          />
        </Box>
      )}
    </VStack>
  );
};

export default GraphContainer;
