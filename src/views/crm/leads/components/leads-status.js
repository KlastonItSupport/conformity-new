import React from "react";
import { Box, HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { CheckFat } from "@phosphor-icons/react";
import { useBreakpoint } from "hooks/usebreakpoint";

const LeadsStatus = ({
  requested,
  refused,
  cancelled,
  inProgress,
  completed,
}) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const { isDesktop } = useBreakpoint();
  const boxInfo = (label, value, isVisible = true) => {
    return (
      <HStack
        margin={{ sm: "0px", md: "0px", lg: "30px 20px" }}
        justify={"space-between"}
        borderBottom={isVisible ? "1px solid #ddd" : null}
        borderTop={isVisible ? "1px solid #ddd" : null}
        w={{ sm: "100%", md: "100%", lg: "18%" }}
        padding={"10px 0px"}
      >
        {isVisible && (
          <>
            {" "}
            <HStack>
              <Box bgColor={"#D74B4B"} borderRadius={"5px"} padding={"4px"}>
                <CheckFat size={22} weight="fill" color="white" />
              </Box>
              <Text fontSize={"md"}>{label}</Text>
            </HStack>
            <Text fontWeight={"bold"} fontSize={"lg"}>
              {value}
            </Text>
          </>
        )}
      </HStack>
    );
  };
  return (
    <Box
      bg={bgColor}
      w={"95vw"}
      py={"10px"}
      border={"1px solid #ddd"}
      borderRadius={"5px"}
    >
      <Text
        padding={{ sm: "0 10px", md: "0", lg: "0px 30px" }}
        fontSize={"xl"}
        color={"header.100"}
        mb={{ sm: "10px", md: "1px", lg: "0px" }}
      >
        (2061) Leads Por Status
      </Text>
      {isDesktop ? (
        <>
          <HStack
            w={"100%"}
            padding={"0px 5px"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            {boxInfo("Solicitado", requested)}
            {boxInfo("Recusado", refused)}
            {boxInfo("Cancelado", cancelled)}
            {boxInfo("Em andamento", inProgress)}
            {boxInfo("Concluído", completed)}
          </HStack>
        </>
      ) : (
        <VStack w={"100%"} padding={"0 10px"} spacing={3}>
          {boxInfo("Solicitado", requested)}
          {boxInfo("Recusado", refused)}
          {boxInfo("Cancelado", cancelled)}
          {boxInfo("Em andamento", inProgress)}
          {boxInfo("Concluído", completed)}
        </VStack>
      )}
    </Box>
  );
};

export default LeadsStatus;
