import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";

import FormInput from "components/form-input/form-input";
import React from "react";

export const CityAndNeighborhood = ({ register, errors }) => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  const fields = [
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Nome"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Cidade *"
      width="100%"
      {...register("city")}
      error={errors.city?.message}
      key={"addCompany-city"}
    />,
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Nome"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Bairro *"
      width="100%"
      {...register("neighborhood")}
      error={errors.neighborhood?.message}
      key={"addCompany-neighborhood"}
    />,
  ];

  return isDesktop ? (
    <HStack w={"100%"}>{[...fields]}</HStack>
  ) : (
    <VStack w={"100%"}>{[...fields]}</VStack>
  );
};
