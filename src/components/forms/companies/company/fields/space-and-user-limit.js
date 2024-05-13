import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";

import FormInput from "components/form-input/form-input";
import React from "react";

export const SpaceLimitAndUsersLimit = ({ register, errors, formValues }) => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  const fields = [
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Memoria limite(MB)"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Limite de espaço (MB) *"
      width="100%"
      {...register("memoryLimit")}
      error={errors.memoryLimit?.message}
      key={"addCompany-memoriLimit"}
      defaultValue={formValues ? formValues.memoryLimit : null}
    />,
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Limite de usuários"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Limite de Usuários (Acesso) *"
      width="100%"
      {...register("usersLimit")}
      error={errors.usersLimit?.message}
      key={"addCompany-usersLimit"}
      defaultValue={formValues ? formValues.usersLimit : null}
    />,
  ];

  return isDesktop ? (
    <HStack w={"100%"}>{[...fields]}</HStack>
  ) : (
    <VStack w={"100%"}>{[...fields]}</VStack>
  );
};
