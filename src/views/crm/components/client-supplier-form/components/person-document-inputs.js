import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import React from "react";

const PersonDocument = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <SelectInput
          label={"Pessoa * "}
          {...register("clientType")}
          error={errors.clientType?.message}
          options={[
            {
              label: "Jurídica",
              value: "juridica",
            },
            {
              label: "Física",
              value: "fisica",
            },
          ]}
          defaultValue={{
            label: formValues?.clientType,
            value: formValues?.clientType,
          }}
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <FormInput
          label={"CNPJ/CPF * "}
          {...register("document")}
          error={errors.document?.message}
          defaultValue={formValues?.document}
        />
      </VStack>
    </HStack>
  );
};

export default PersonDocument;
