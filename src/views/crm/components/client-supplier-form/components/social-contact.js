import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";

import React from "react";

const SocialContact = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <FormInput
          label={"Razão Social * "}
          {...register("fantasyName")}
          error={errors.fantasyName?.message}
          defaultValue={formValues?.fantasyName}
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <FormInput
          label={"Contato * "}
          {...register("contact")}
          error={errors.contact?.message}
          defaultValue={formValues?.contact}
        />
      </VStack>
    </HStack>
  );
};

export default SocialContact;
