import { Box, Text } from "@chakra-ui/react";
import { useBreakpoint } from "hooks/usebreakpoint";
import React from "react";

const CertificateDetails = () => {
  const { isMobile } = useBreakpoint();
  return (
    <Box
      w={"95vw"}
      justifyContent={"space-between"}
      bgColor={"white"}
      p={"20px"}
      mb={"20px !important"}
      border={"1px solid #E0E0E0"}
      display={"flex"}
      flexDir={isMobile ? "column" : "row"}
    >
      <Text py={"5px"}>
        <Text as={"span"} fontWeight={"bold"}>
          Usuário:{" "}
        </Text>
        Gustavo
      </Text>
      <Text py={"5px"}>
        <Text as={"span"} fontWeight={"bold"}>
          Treinamento:{" "}
        </Text>
        ISO-9001
      </Text>
      <Text py={"5px"}>
        <Text as={"span"} fontWeight={"bold"}>
          Vencimento:{" "}
        </Text>
        12/12/2021
      </Text>
    </Box>
  );
};

export default CertificateDetails;
