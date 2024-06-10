import {
  Center,
  Checkbox,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import React, { useContext, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { groupSchema } from "./schema";
import { CompanyContext } from "providers/company";
import { SelectDropDown } from "components/select-drop-down";
import { GroupContext } from "providers/group";
import { getCheckBoxes } from "./helper";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const GroupForm = ({
  formRef,
  type = "create",
  formValues,
  onCloseModal,
}) => {
  const { getCompanyUsers, users } = useContext(CompanyContext);
  const { createGroup, editGroup, getUsersGroup } = useContext(GroupContext);
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [groupUsers, setGroupUsers] = useState([]);
  const [checkboxList, setCheckBoxList] = useState(
    type === "create"
      ? getCheckBoxes(false)
      : {
          documents: formValues.documents,
          tasks: formValues.tasks,
          equipments: formValues.equipments,
          indicators: formValues.indicators,
          crm: formValues.crm,
          training: formValues.training,
          companies: formValues.companies,
        }
  );

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupSchema),
  });

  useController({
    name: "users",
    control,
  });

  const onSubmit = async (data) => {
    const users =
      data.users && data.users.length > 0
        ? data.users.map((user) => user.value)
        : [];

    const payload = {
      ...data,
      users: users,
      permissions: { ...checkboxList },
    };

    if (type === "create") {
      await createGroup(payload);
      onCloseModal();
      return;
    }

    payload.id = formValues.id;
    await editGroup(payload);
    onCloseModal();
  };

  const buildCheckBoxes = (title, access) => {
    return (
      <VStack justifyContent={"start"} paddingY={"15px"} alignItems={"start"}>
        <Text fontWeight={"bold"}> {title}</Text>
        <HStack justifyContent={"space-evenly"}>
          <Checkbox
            pr={"25px"}
            isChecked={checkboxList[access].canAdd === 1 ? true : false}
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
            {t("Adicionar")}
          </Checkbox>
          <Checkbox
            pr={"25px"}
            isChecked={checkboxList[access].canRead === 1 ? true : false}
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
            {t("Visualizar")}
          </Checkbox>
          <Checkbox
            pr={"25px"}
            isChecked={checkboxList[access].canEdit === 1 ? true : false}
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
            {t("Editar")}
          </Checkbox>
          <Checkbox
            isChecked={checkboxList[access].canDelete === 1 ? true : false}
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
            {t("Deletar")}
          </Checkbox>
        </HStack>
      </VStack>
    );
  };

  const options = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const giveAllPermissions = () => {
    return (
      <VStack justifyContent={"start"} paddingY={"15px"} alignItems={"start"}>
        <Text fontWeight={"bold"}> {t("Dar Todas as permissoes")}</Text>
        <Checkbox
          pr={"25px"}
          onChange={(e) => {
            setCheckBoxList(getCheckBoxes(e.currentTarget.checked));
          }}
        >
          {t("Selecione para dar todas as permissoes")}
        </Checkbox>
      </VStack>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getCompanyUsers();

      if (type !== "create") {
        const users = await getUsersGroup(formValues.id);
        const mappedUsers = users.map((user) => ({
          label: user.name,
          value: user.id,
        }));

        setGroupUsers(mappedUsers);
        if (mappedUsers.length > 0) {
          setValue("users", [mappedUsers[0]]);
        }
      }
      setIsLoading(false);
    };
    fetchData();
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
          label={t("Nome do grupo *")}
          width="100%"
          {...register("name")}
          error={errors.name?.message}
          defaultValue={type !== "create" ? formValues.name : undefined}
        />

        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <SelectDropDown
            options={options}
            label={t("Selecione os usuários")}
            error={errors.users}
            control={control}
            name={"users"}
            placeholder={t("Clique ou digite para adicionar o usuário")}
          />
        )}
        {giveAllPermissions()}
        {buildCheckBoxes(t("Documentos"), "documents")}
        {buildCheckBoxes(t("Tasks"), "tasks")}
        {buildCheckBoxes(t("Equipamentos"), "equipments")}
        {buildCheckBoxes(t("Indicadores"), "indicators")}
        {buildCheckBoxes(t("CRM"), "crm")}
        {buildCheckBoxes(t("Treinamentos"), "training")}
        {buildCheckBoxes(t("Empresas"), "companies")}
      </form>
    </VStack>
  );
};
