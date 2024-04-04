import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";

import FormInput from "components/form-input/form-input";
import React from "react";

export const StreetAndNumber = ({ register, errors }) => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  const fields = [
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Endereço"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Endereço *"
      width="100%"
      {...register("address")}
      error={errors.address?.message}
      key={"addCompany-address"}
    />,
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Número"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Número *"
      width="100%"
      {...register("number")}
      error={errors.number?.message}
      key={"addCompany-number"}
    />,
  ];

  return isDesktop ? (
    <HStack w={"100%"}>{[...fields]}</HStack>
  ) : (
    <VStack w={"100%"}>{[...fields]}</VStack>
  );
};
