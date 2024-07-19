import { Flex, HStack, VStack } from "@chakra-ui/react";
import { Plus } from "@phosphor-icons/react";
import SelectInput from "components/select";
import React from "react";
import { useTranslation } from "react-i18next";

const PrevisionAndDepartament = ({
  register,
  formValues,
  errors,
  departaments,
  onDepartamentModalOpen,
}) => {
  const { t } = useTranslation();

  return (
    <HStack w={"100%"}>
      <VStack w={"100%"} align={"start"} mt={"20px"}>
        <SelectInput
          errors={errors.departament}
          label={t("Departamento")}
          defaultValue={
            formValues?.departament
              ? {
                  label: formValues?.departament,
                  value: formValues?.departamentId,
                }
              : { label: "Selecione um departamento", value: "not-selected" }
          }
          options={departaments}
          {...register("departament")}
        />
      </VStack>
      <Flex
        bgColor={"primary.100"}
        cursor={"pointer"}
        style={{ marginTop: "60px" }}
        padding={"5px"}
        onClick={onDepartamentModalOpen}
      >
        <Plus color="white" size={20} weight="bold" />
      </Flex>
    </HStack>
  );
};

export default PrevisionAndDepartament;
