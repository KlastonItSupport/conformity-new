import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";

import FormInput from "components/form-input/form-input";
import SelectInput from "components/select";
import React from "react";

export const StatusAndLimitGeralUsers = ({ register, errors }) => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  const fields = [
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Nome"
      margin="0 0 0px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Limite de Usuários (Geral)*"
      width="100%"
      key={"addCompany-generaLimit"}
    />,
    <VStack w={"100%"} align={"start"} justify={"start"} m={"0px"}>
      <SelectInput
        label="Status"
        {...register("status")}
        errors={errors.status}
        options={[
          {
            label: "Ativo",
            value: "ativo",
          },
          {
            label: "Inativo",
            value: "inativo",
          },
        ]}
        key={"addCompany-status"}
      />
      ,
    </VStack>,
  ];

  return isDesktop ? (
    <HStack w={"100%"}>{[...fields]}</HStack>
  ) : (
    <VStack w={"100%"}>{[...fields]}</VStack>
  );
};
