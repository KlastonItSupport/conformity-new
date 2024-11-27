import { HStack, Text, VStack } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { SelectDropDown } from "components/select-drop-down";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Permissions from "./permissions";
import { yupResolver } from "@hookform/resolvers/yup";

import * as Yup from "yup";
import {
  addDepartamentsPermissions,
  getDepartamentPermissions,
} from "../helpers/departament-permissions-helper";
import { DepartamentContext } from "providers/departament";
import { AuthContext } from "providers/auth";

const schema = Yup.object().shape({
  departaments: Yup.array(),
});

const DepartamentPermissions = ({ documentId }) => {
  const { t } = useTranslation();
  const [departaments, setDepartaments] = useState([]);
  const [departamentsPermissions, setDepartamentsPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getDepartaments } = useContext(DepartamentContext);
  const { checkPermissionForAction, getToken } = useContext(AuthContext);

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await addDepartamentsPermissions(
      documentId,
      data.departaments,
      departamentsPermissions,
      setDepartamentsPermissions,
      getToken()
    );

    reset({ departaments: [] });
    setIsLoading(false);
  };

  const onInit = async () => {
    const departaments = await getDepartaments();
    await getDepartamentPermissions(documentId, setDepartamentsPermissions);

    const formattedDepartaments = departaments.map((departament) => ({
      label: departament.name,
      value: departament.id,
    }));

    setDepartaments(formattedDepartaments);
  };
  useEffect(() => {
    onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      bgColor={"#FFFFFF"}
      marginInlineStart={0}
      p={"25px"}
      border={"1px solid #ddd"}
      alignItems={"start"}
      mt={"20px"}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <HStack
        justifyContent={"space-between"}
        w={"100%"}
        color={"#0075df"}
        cursor={"pointer"}
      >
        <Text fontSize={"20px"} color={"header.100"}></Text>
        <ButtonPrimary
          fontSize="sm"
          fontWeight="bold"
          mb="24px"
          bgColor={"primary.100"}
          _hover={{ bgColor: "primary.200" }}
          textColor={"white"}
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
          borderRadius="7px"
          _active={{ bgColor: "primary.200" }}
          type="submit"
          label={"Adicionar"}
          width="100px"
          padding={"5px"}
          h="40px"
          isLoading={isLoading}
          disabled={!checkPermissionForAction("documents", "canAdd")}
        />
      </HStack>
      <Text
        fontSize={{ lg: "24px", md: "32px", sm: "24px" }}
        color={"navy.700"}
        fontWeight={"bold"}
      >
        Departamentos com Permissões
      </Text>
      {departaments.length > 0 && (
        <SelectDropDown
          options={departaments}
          label={t("Liberar departamento")}
          control={control}
          name={"departaments"}
          placeholder={t("Clique ou digite para adicionar o usuário")}
        />
      )}
      <Permissions
        departamentsPermissions={departamentsPermissions}
        setDepartamentsPermissions={setDepartamentsPermissions}
        canDelete={checkPermissionForAction("documents", "canDelete")}
      />
    </VStack>
  );
};

export default DepartamentPermissions;
