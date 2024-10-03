import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";

import React from "react";

const Registrations = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <FormInput
          label={"Inscrição Municipal * "}
          {...register("citySubscription")}
          error={errors.citySubscription?.message}
          defaultValue={formValues?.citySubscription}
          placeHolder="Ex: 123456"
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <FormInput
          label={"Inscrição Estadual * "}
          {...register("stateSubscription")}
          error={errors.stateSubscription?.message}
          defaultValue={formValues?.stateSubscription}
          placeHolder="Ex: 123456"
        />
      </VStack>
    </HStack>
  );
};

export default Registrations;
