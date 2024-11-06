import { Box, Text } from "@chakra-ui/react";
import { useBreakpoint } from "hooks/usebreakpoint";
import moment from "moment";
import React, { useEffect, useState } from "react";

const CertificateDetails = ({ getCertificatesDetails, id }) => {
  const { isMobile } = useBreakpoint();
  const [details, setDetails] = useState({
    userName: "",
    date: "",
    name: "",
  });

  useEffect(() => {
    getCertificatesDetails(id).then((res) => {
      setDetails(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {details.userName}
      </Text>
      <Text py={"5px"}>
        <Text as={"span"} fontWeight={"bold"}>
          Treinamento:{" "}
        </Text>
        {details.name}
      </Text>
      <Text py={"5px"}>
        <Text as={"span"} fontWeight={"bold"}>
          Vencimento:{" "}
        </Text>
        {moment(details.date).format("DD/MM/YYYY")}
      </Text>
    </Box>
  );
};

export default CertificateDetails;
