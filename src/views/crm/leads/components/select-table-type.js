import { Box, HStack, Text } from "@chakra-ui/react";
import React from "react";

const SelectTableType = ({ selectedTable, setSelectedTable }) => {
  const button = (label, value) => (
    <Box
      bgColor={selectedTable === value ? "white" : "none"}
      p={"15px"}
      borderTop={selectedTable === value ? "1px solid #ddd" : "none"}
      borderLeft={selectedTable === value ? "1px solid #ddd" : "none"}
      borderRight={selectedTable === value ? "1px solid #ddd" : "none"}
      borderRadius={"5px"}
      marginLeft={"0px !important"}
      cursor={"pointer"}
      onClick={() => setSelectedTable(value)}
    >
      <Text
        color={selectedTable === value ? "#D74B4B" : "none"}
        fontWeight={"semibold"}
      >
        {label}
      </Text>
    </Box>
  );
  return (
    <HStack width={"95vw"} mt="20px !important">
      {button("Leads", "leads")}
      {button("Tarefas", "tasks")}
    </HStack>
  );
};

export default SelectTableType;
