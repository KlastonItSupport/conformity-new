import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";

import React from "react";

const EmailCelphone = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <FormInput
          label={"Email * "}
          {...register("email")}
          error={errors.email?.message}
          defaultValue={formValues?.email}
          placeholder="Ex: it.support@klaston.com"
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <FormInput
          label={"Telefone * "}
          {...register("celphone")}
          error={errors.celphone?.message}
          defaultValue={formValues?.celphone}
          placeholder="Ex: +55 11 99999-9999"
        />
      </VStack>
    </HStack>
  );
};

export default EmailCelphone;
