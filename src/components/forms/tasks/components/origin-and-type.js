import { Flex, HStack, VStack } from "@chakra-ui/react";
import { Plus } from "@phosphor-icons/react";
import SelectInput from "components/select";
import React from "react";
import { useTranslation } from "react-i18next";

const OriginAndType = ({
  register,
  formValues,
  errors,
  origins,
  types,
  onOriginModalOpen,
  onTypeModalOpen,
}) => {
  const { t } = useTranslation();
  return (
    <VStack mt={"25px"}>
      <HStack w={"100%"}>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.origin}
            label={t("Origem")}
            defaultValue={
              formValues?.origin
                ? { label: formValues?.origin, value: formValues?.originId }
                : { label: "Selecione uma Origem", value: "not-selected" }
            }
            options={origins}
            {...register("origin")}
          />
        </VStack>
        <Flex
          bgColor={"primary.100"}
          cursor={"pointer"}
          style={{ marginTop: "40px" }}
          padding={"5px"}
          onClick={onOriginModalOpen}
        >
          <Plus color="white" size={20} weight="bold" />
        </Flex>
      </HStack>
      <HStack w={"100%"}>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.type}
            label={t("Tipo")}
            defaultValue={
              formValues?.type
                ? { label: formValues?.type, value: formValues?.typeId }
                : { label: "Selecione um tipo", value: "not-selected" }
            }
            options={types}
            {...register("type")}
          />
        </VStack>
        <Flex
          bgColor={"primary.100"}
          cursor={"pointer"}
          style={{ marginTop: "40px" }}
          padding={"5px"}
          onClick={onTypeModalOpen}
        >
          <Plus color="white" size={20} weight="bold" />
        </Flex>
      </HStack>
    </VStack>
  );
};

export default OriginAndType;
