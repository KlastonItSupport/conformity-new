import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";

import FormInput from "components/form-input/form-input";
import React from "react";

export const ZipeCodeAndCelphone = ({ register, errors }) => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  const fields = [
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="CEP"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="CEP *"
      width="100%"
      {...register("zipCode")}
      error={errors.zipCode?.message}
      key={"addCompany-zipCode"}
    />,
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Telefone"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Telefone *"
      width="100%"
      {...register("celphone")}
      error={errors.celphone?.message}
      key={"addCompany-celphone"}
    />,
  ];

  return isDesktop ? (
    <HStack w={"100%"}>{[...fields]}</HStack>
  ) : (
    <VStack w={"100%"}>{[...fields]}</VStack>
  );
};
