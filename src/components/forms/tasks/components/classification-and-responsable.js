import { Flex, HStack, VStack } from "@chakra-ui/react";
import { Plus } from "@phosphor-icons/react";
import SelectInput from "components/select";
import React from "react";
import { useTranslation } from "react-i18next";

const ClassificationAndResponsable = ({
  register,
  formValues,
  errors,
  classifications,
  responsables,
  onClassificationModalOpen,
  onResponsableModalOpen,
}) => {
  const { t } = useTranslation();
  return (
    <VStack mt={"25px"}>
      <HStack w={"100%"}>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.classification}
            label={t("Classificação")}
            options={classifications}
            defaultValue={
              formValues?.classification
                ? {
                    label: formValues?.classification,
                    value: formValues?.classificationId,
                  }
                : {
                    label: "Selecione uma classificação",
                    value: "not-selected",
                  }
            }
            {...register("classification")}
          />
        </VStack>
        <Flex
          bgColor={"primary.100"}
          cursor={"pointer"}
          style={{ marginTop: "40px" }}
          padding={"5px"}
          onClick={onClassificationModalOpen}
        >
          <Plus color="white" size={20} weight="bold" />
        </Flex>
      </HStack>
      <HStack w={"100%"}>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.responsable}
            label={t("Adicionar um avaliador")}
            defaultValue={
              formValues?.responsable
                ? {
                    label: formValues?.responsable,
                    value: formValues?.responsable,
                  }
                : { label: "Selecione um Avaliador", value: "not-selected" }
            }
            options={responsables}
            {...register("responsable")}
          />
        </VStack>
        <Flex
          bgColor={"primary.100"}
          cursor={"pointer"}
          style={{ marginTop: "40px" }}
          padding={"5px"}
          onClick={onResponsableModalOpen}
        >
          <Plus color="white" size={20} weight="bold" />
        </Flex>
      </HStack>
    </VStack>
  );
};

export default ClassificationAndResponsable;
