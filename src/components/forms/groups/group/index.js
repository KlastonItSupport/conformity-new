import { Checkbox, HStack, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { groupSchema } from "./schema";

export const GroupForm = ({ formRef, onCloseModal }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupSchema),
  });

  const [checkboxList, setCheckBoxList] = useState({
    documents: {
      canRead: false,
      canDelete: false,
      canEdit: false,
    },
    tasks: {
      canRead: false,
      canDelete: false,
      canEdit: false,
    },
    equipments: {
      canRead: false,
      canDelete: false,
      canEdit: false,
    },
    indicators: { canRead: false, canDelete: false, canEdit: false },
    crm: { canRead: false, canDelete: false, canEdit: false },
    training: { canRead: false, canDelete: false, canEdit: false },
    companies: { canRead: false, canDelete: false, canEdit: false },
  });

  const onSubmit = (data) => {
    console.log(data);
    console.log("checkboxes", checkboxList);
  };

  const buildCheckBoxes = (title, access) => {
    return (
      <VStack justifyContent={"start"} paddingY={"15px"} alignItems={"start"}>
        <Text fontWeight={"bold"}> {title}</Text>
        <HStack justifyContent={"space-evenly"}>
          <Checkbox
            pr={"25px"}
            onChange={(e) => {
              setCheckBoxList({
                ...checkboxList,
                [access]: {
                  ...checkboxList[access],
                  canRead: e.currentTarget.checked,
                },
              });
            }}
          >
            Vizualizar
          </Checkbox>
          <Checkbox
            pr={"25px"}
            onChange={(e) => {
              setCheckBoxList({
                ...checkboxList,
                [access]: {
                  ...checkboxList[access],
                  canEdit: e.currentTarget.checked,
                },
              });
            }}
          >
            Editar
          </Checkbox>
          <Checkbox
            onChange={(e) => {
              setCheckBoxList({
                ...checkboxList,
                [access]: {
                  ...checkboxList[access],
                  canDelete: e.currentTarget.checked,
                },
              });
            }}
          >
            Deletar
          </Checkbox>
        </HStack>
      </VStack>
    );
  };
  return (
    <VStack w={"100%"} alignItems={"start"}>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%" }}
      >
        <FormInput
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          placeholder="Ex: Marketing"
          margin="0 0 10px 0 "
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label="Nome do grupo *"
          width="100%"
          {...register("name")}
          error={errors.name?.message}
        />
        {buildCheckBoxes("Documentos", "documents")}
        {buildCheckBoxes("Tasks", "tasks")}
        {buildCheckBoxes("Equipamentos", "equipments")}
        {buildCheckBoxes("Indicadores", "indicators")}
        {buildCheckBoxes("CRM", "crm")}
        {buildCheckBoxes("Treinamentos", "training")}
        {buildCheckBoxes("Empresas", "companies")}
      </form>
    </VStack>
  );
};
