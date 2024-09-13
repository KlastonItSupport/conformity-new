import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import React from "react";

const CityNeihborhood = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <SelectInput
          label={"Cidade * "}
          {...register("city")}
          error={errors.city?.message}
          defaultValue={formValues?.city}
          options={[]}
        />
      </VStack>
      <VStack align={"start"} w={"100%"}>
        <FormInput
          label={"Bairro * "}
          {...register("neighborhood")}
          error={errors.neighborhood?.message}
          defaultValue={formValues?.neighborhood}
        />
      </VStack>
    </HStack>
  );
};

export default CityNeihborhood;
