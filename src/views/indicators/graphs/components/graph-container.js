import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2"; // Importe o Pie aqui
import { Chart, defaults } from "chart.js/auto";
import { useBreakpoint } from "hooks/usebreakpoint";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const GraphContainer = () => {
  const { isMobile } = useBreakpoint();
  const revenueData = [
    { label: "Jan", revenue: 64854, cost: 32652 },
    { label: "Feb", revenue: 54628, cost: 42393 },
    { label: "Mar", revenue: 117238, cost: 50262 },
    { label: "Apr", revenue: 82830, cost: 64731 },
    { label: "May", revenue: 91208, cost: 41893 },
    { label: "Jun", revenue: 103609, cost: 83809 },
    { label: "Jul", revenue: 90974, cost: 44772 },
    { label: "Aug", revenue: 82919, cost: 37590 },
    { label: "Sep", revenue: 62407, cost: 43349 },
    { label: "Oct", revenue: 82528, cost: 45324 },
    { label: "Nov", revenue: 56979, cost: 47978 },
    { label: "Dec", revenue: 87436, cost: 39175 },
  ];

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
        Departamento: TI - Tipo de dado: PERCENTUAL - Frequência: MENSAL
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
            data={{
              labels: revenueData.map((data) => data.label),
              datasets: [
                {
                  label: "Revenue",
                  data: revenueData.map((data) => data.revenue),
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                },
                {
                  label: "Cost",
                  data: revenueData.map((data) => data.cost),
                  backgroundColor: "#FF3030",
                  borderColor: "#FF3030",
                },
              ],
            }}
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
            data={{
              labels: revenueData.map((data) => data.label),
              datasets: [
                {
                  label: "Revenue",
                  data: revenueData.map((data) => data.revenue),
                  backgroundColor: "#064FF0",
                },
                {
                  label: "Cost",
                  data: revenueData.map((data) => data.cost),
                  backgroundColor: "#FF3030",
                },
              ],
            }}
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
            data={{
              labels: revenueData.map((data) => data.label),
              datasets: [
                {
                  label: "Revenue",
                  data: revenueData.map((data) => data.revenue),
                  backgroundColor: "#064FF0",
                },
                {
                  label: "Cost",
                  data: revenueData.map((data) => data.cost),
                  backgroundColor: "#FF3030",
                },
              ],
            }}
            options={{
              indexAxis: "y", // Altera a orientação para horizontal
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

      {selectedGraph === "pie" && (
        <Box w={"100%"} minH={"100%"} h={{ lg: "520px", sm: "500px" }}>
          <Pie
            data={{
              labels: revenueData.map((data) => data.label),
              datasets: [
                {
                  label: "Revenue",
                  data: revenueData.map((data) => data.revenue),
                  backgroundColor: revenueData.map((data, index) =>
                    index % 2 === 0 ? "#064FF0" : "#FF3030"
                  ),
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Monthly Revenue Distribution (Pie Chart)",
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
