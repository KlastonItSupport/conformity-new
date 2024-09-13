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
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <FormInput
          label={"Telefone * "}
          {...register("celphone")}
          error={errors.celphone?.message}
          defaultValue={formValues?.celphone}
        />
      </VStack>
    </HStack>
  );
};

export default EmailCelphone;
