import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";
import React from "react";

const NumberComplement = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <FormInput
          label={"Número * "}
          {...register("number")}
          error={errors.number?.message}
          defaultValue={formValues?.number}
          options={[]}
        />
      </VStack>
      <VStack align={"start"} w={"100%"}>
        <FormInput
          label={"Complemento * "}
          {...register("complement")}
          error={errors.complement?.message}
          defaultValue={formValues?.complement}
        />
      </VStack>
    </HStack>
  );
};

export default NumberComplement;
