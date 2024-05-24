import { HStack, Text, VStack } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { SelectDropDown } from "components/select-drop-down";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Permissions from "./permissions";

const DepartamentPermissions = () => {
  const { t } = useTranslation();
  const { control } = useForm({});

  const options = [
    {
      value: "it",
      label: "IT Departament",
    },
    {
      value: "dp",
      label: "Departamento Pessoal",
    },
  ];

  return (
    <VStack
      bgColor={"#FFFFFF"}
      marginInlineStart={0}
      p={"25px"}
      border={"1px solid #ddd"}
      alignItems={"start"}
      mt={"20px"}
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
        />
      </HStack>
      <Text
        fontSize={{ lg: "24px", md: "32px", sm: "24px" }}
        color={"navy.700"}
        fontWeight={"bold"}
        // paddingBottom={isMobile ? "10px" : "0"}
      >
        Departamentos com Permissões
      </Text>
      <SelectDropDown
        options={options}
        label={t("Liberar departamento")}
        defaultValue={{ label: "Padrão", value: "default" }}
        // error={errors.users}
        control={control}
        name={"users"}
        placeholder={t("Clique ou digite para adicionar o usuário")}
      />
      <Permissions />
    </VStack>
  );
};

export default DepartamentPermissions;
