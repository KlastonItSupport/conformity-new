import {
  Container,
  Flex,
  HStack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Plus } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import DepartamentForm from "components/forms/departaments/create-departament";
import SelectInput from "components/select";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

const SelectsInputs = ({ register, errors }) => {
  const categoryRef = useRef(null);
  const departamentRef = useRef(null);
  const { t } = useTranslation();

  const {
    isOpen: isDepartamentModalOpen,
    onOpen: onDepartamentModalOpen,
    onClose: onDepartamentModalClose,
  } = useDisclosure();

  const {
    isOpen: isCategoryModalOpen,
    onOpen: onCategoryModalOpen,
    onClose: onCategoryModalClose,
  } = useDisclosure();

  return (
    <>
      <SelectInput
        label="Projetos"
        {...register("project")}
        errors={errors.project}
        options={[
          {
            label: "Rigrabas",
            value: "ativo",
          },
          {
            label: "Unimed",
            value: "inativo",
          },
          {
            label: "Klaston",
            value: "inativo",
          },
        ]}
      />
      <HStack
        w={"100%"}
        h={"100%"}
        alignContent={"center"}
        alignItems={"center"}
        margin="0 0 10px 0 "
      >
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            label="Departamento"
            {...register("departament")}
            errors={errors.departament}
            options={[
              {
                label: "IT",
                value: "ativo",
              },
              {
                label: "RH",
                value: "rh",
              },
              {
                label: "Marketing",
                value: "marketing",
              },
              {
                label: "Vendas",
                value: "sales",
              },
              {
                label: "RH",
                value: "rh",
              },
            ]}
          />
        </VStack>
        <Flex
          bgColor={"primary.100"}
          cursor={"pointer"}
          style={{ marginTop: "40px" }}
          padding={"5px"}
        >
          <Plus
            color="white"
            size={20}
            weight="bold"
            onClick={onDepartamentModalOpen}
          />
        </Flex>
      </HStack>
      <HStack>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            label="Categoria"
            {...register("category")}
            errors={errors.category}
            options={[
              {
                label: "Procedimentos",
                value: "ativo",
              },
              {
                label: "Formulário",
                value: "rh",
              },
              {
                label: "Manuais",
                value: "marketing",
              },
              {
                label: "Requisitos Clientes",
                value: "sales",
              },
            ]}
            key={"addCompany-status"}
          />
        </VStack>
        <Container
          bgColor={"primary.100"}
          cursor={"pointer"}
          padding={"5px"}
          w={"30px"}
          height={"100%"}
          style={{ marginTop: "35px" }}
        >
          <Plus
            color="white"
            size={20}
            weight="bold"
            onClick={onCategoryModalOpen}
          />
        </Container>
      </HStack>
      <ModalForm
        isOpen={isDepartamentModalOpen}
        onClose={onDepartamentModalClose}
        form={
          <DepartamentForm
            formRef={departamentRef}
            onCloseModal={onDepartamentModalClose}
          />
        }
        formRef={departamentRef}
        title={t("Criar Departamento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
      />

      <ModalForm
        isOpen={isCategoryModalOpen}
        onClose={onCategoryModalClose}
        form={
          <DepartamentForm
            formRef={categoryRef}
            onCloseModal={onCategoryModalClose}
          />
        }
        formRef={categoryRef}
        title={t("Criar Categoria")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
      />
    </>
  );
};

export default SelectsInputs;
