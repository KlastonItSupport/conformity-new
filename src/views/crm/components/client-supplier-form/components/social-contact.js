import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";

import React from "react";

const SocialContact = ({ register, errors, formValues }) => {
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <FormInput
          label={"Razão Social * "}
          {...register("socialReason")}
          error={errors.socialReason?.message}
          defaultValue={formValues?.socialReason}
          placeHolder="Ex: Klaston Management"
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <FormInput
          label={"Contato * "}
          {...register("contact")}
          error={errors.contact?.message}
          defaultValue={formValues?.contact}
          placeHolder="Ex: (99)99999-9999"
        />
      </VStack>
    </HStack>
  );
};

export default SocialContact;
