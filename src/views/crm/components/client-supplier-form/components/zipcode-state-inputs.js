import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import React from "react";

const ZipCodeStates = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <FormInput
          label={"CEP * "}
          {...register("zipcode")}
          error={errors.zipcode?.message}
          defaultValue={formValues?.zipcode}
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <SelectInput
          label={"Estado * "}
          {...register("state")}
          error={errors.state?.message}
          defaultValue={formValues?.state}
          options={[]}
        />
      </VStack>
    </HStack>
  );
};

export default ZipCodeStates;
