import { HStack, Text } from "@chakra-ui/react";
import React from "react";

const SquareInfos = ({ label, value }) => {
  return (
    <HStack
      bgColor={"white"}
      border={"1px solid"}
      borderColor={"#dddddd"}
      p={"15px"}
      borderRadius={"5px"}
      w={"100%"}
      m={{ lg: "0px 10px 0px 0px", sm: "8px 0px", md: "0px" }}
      justifyContent={"space-between"}
    >
      <Text fontSize={"lg"} color={"#999999"}>
        {label}
      </Text>
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        {value}
      </Text>
    </HStack>
  );
};

export default SquareInfos;
