import { Checkbox, HStack, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import React, { useContext, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { groupSchema } from "./schema";
import { CompanyContext } from "providers/company";
import { SelectDropDown } from "components/select-drop-down";
import { GroupContext } from "providers/group";
import { checkBoxStart } from "./helper";

export const GroupForm = ({ formRef, onCloseModal }) => {
  const { getCompanyUsers, users } = useContext(CompanyContext);
  const { createGroup } = useContext(GroupContext);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupSchema),
  });

  useController({
    name: "users",
    control,
  });

  const [checkboxList, setCheckBoxList] = useState(checkBoxStart);

  const onSubmit = (data) => {
    const users = data.users.map((user) => user.value);

    createGroup({
      ...data,
      users: users,
      permissions: { ...checkboxList },
    });
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
                  canAdd: e.currentTarget.checked ? 1 : 0,
                },
              });
            }}
          >
            Adicionar
          </Checkbox>
          <Checkbox
            pr={"25px"}
            onChange={(e) => {
              setCheckBoxList({
                ...checkboxList,
                [access]: {
                  ...checkboxList[access],
                  canRead: e.currentTarget.checked ? 1 : 0,
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
                  canEdit: e.currentTarget.checked ? 1 : 0,
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
                  canDelete: e.currentTarget.checked ? 1 : 0,
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

  const options = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  useEffect(() => {
    getCompanyUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        <SelectDropDown
          options={options}
          label={"Selecione os usuários"}
          error={errors.users}
          control={control}
          name={"users"}
          placeholder="Clique ou digite para adicionar o usuário"
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
