import { HStack, VStack } from "@chakra-ui/react";
import SelectInput from "components/select";
import React from "react";

const TypeStatus = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <SelectInput
          label={"Status * "}
          {...register("status")}
          error={errors.status?.message}
          options={[
            {
              label: "Ativo",
              value: "Ativo",
            },
            {
              label: "Inativo",
              value: "Inativo",
            },
          ]}
        />
      </VStack>
      <VStack align={"start"} w={"100%"}>
        <SelectInput
          label={"Tipo * "}
          {...register("type")}
          error={errors.type?.message}
          defaultValue={{ label: formValues?.type, value: formValues?.type }}
          options={[
            {
              label: "Cliente",
              value: "client",
            },
            {
              label: "Fornecedor",
              value: "Supplier",
            },
          ]}
        />
      </VStack>
    </HStack>
  );
};

export default TypeStatus;
