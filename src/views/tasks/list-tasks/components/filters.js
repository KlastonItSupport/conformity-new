import { HStack, VStack } from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import SelectInput from "components/select";
import { useQuery } from "hooks/query";
import { useBreakpoint } from "hooks/usebreakpoint";
import { CategoryContext } from "providers/category";
import { DepartamentContext } from "providers/departament";
import { DocumentContext } from "providers/document";
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";

export const filtersSchema = Yup.object().shape({
  initialDate: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  endDate: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  departamentId: Yup.string(),
  categoryId: Yup.string(),
  author: Yup.string(),
});

const Filters = () => {
  const [isShowingCalendarInitial, setIsShowingCalendarInitial] =
    useState(false);
  const [isShowingCalendarEnd, setIsShowingCalendarEnd] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const { departaments } = useContext(DepartamentContext);
  const { categories } = useContext(CategoryContext);
  const { getDocuments, setDocuments } = useContext(DocumentContext);

  const [formDefaultValues, setFormDefaultValues] = useState({});

  const { isMobile } = useBreakpoint();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm(filtersSchema);

  const statusInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Status"
        {...register("status")}
        errors={errors.status}
        defaultValue={{
          label: "Selecione um status",
          value: "not-selected",
        }}
        options={[
          {
            label: "Aberta",
            value: "open",
          },
          {
            label: "Fechada",
            value: "closed",
          },
          {
            label: "Reaberta",
            value: "reopened",
          },
        ]}
      />
    </VStack>
  );

  const originInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Origem "
        {...register("origin")}
        errors={errors.origin}
        defaultValue={{
          label: "Selecione uma origem",
          value: "not-selected",
        }}
        options={[
          {
            label: "Aberta",
            value: "open",
          },
          {
            label: "Fechada",
            value: "closed",
          },
          {
            label: "Reaberta",
            value: "reopened",
          },
        ]}
      />
    </VStack>
  );

  const classificationInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Classificação"
        {...register("classification")}
        errors={errors.classification}
        defaultValue={{
          label: "Selecione uma classificação",
          value: "not-selected",
        }}
        options={[
          {
            label: "Aberta",
            value: "open",
          },
          {
            label: "Fechada",
            value: "closed",
          },
          {
            label: "Reaberta",
            value: "reopened",
          },
        ]}
      />
    </VStack>
  );

  const projectInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Projeto"
        {...register("project")}
        errors={errors.project}
        defaultValue={{
          label: "Selecione um projeto",
          value: "not-selected",
        }}
        options={[
          {
            label: "Aberta",
            value: "open",
          },
          {
            label: "Fechada",
            value: "closed",
          },
          {
            label: "Reaberta",
            value: "reopened",
          },
        ]}
      />
    </VStack>
  );

  const typeInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Tipo"
        {...register("type")}
        errors={errors.type}
        options={[
          {
            label: "Selecione um tipo",
            value: "not-selected",
          },
        ]}
      />
    </VStack>
  );

  const departamentInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Deppartamento"
        {...register("departament")}
        errors={errors.departament}
        options={[
          {
            label: "Selecione um tipo",
            value: "not-selected",
          },
        ]}
      />
    </VStack>
  );

  const onSubmit = async (data) => {};
  return isMobile ? (
    <VStack w={"100%"} paddingX={"20px"} as="form">
      {statusInput}
      {originInput}

      {classificationInput}
      {projectInput}
      {typeInput}
      {departamentInput}
      <ButtonPrimary
        fontSize="sm"
        fontWeight="bold"
        h="50"
        bgColor={"primary.100"}
        _hover={{ bgColor: "primary.200" }}
        textColor={"white"}
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
        borderRadius="7px"
        _active={{ bgColor: "primary.200" }}
        label={"Filtrar"}
        width="100%"
        m={"10px  20px !important"}
      />
    </VStack>
  ) : (
    <HStack
      justifyContent={"space-between"}
      w={"95%"}
      position="relative"
      pb={"20px"}
      alignItems={"center"}
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      {statusInput}
      {originInput}
      {classificationInput}
      {typeInput}
      {projectInput}
      {departamentInput}

      <ButtonPrimary
        fontSize="sm"
        fontWeight="bold"
        h="50"
        bgColor={"primary.100"}
        _hover={{ bgColor: "primary.200" }}
        textColor={"white"}
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
        borderRadius="7px"
        _active={{ bgColor: "primary.200" }}
        label={<MagnifyingGlass size={32} color={"white"} />}
        width="150px"
        mt={"35px !important"}
        type="submit"
      />
    </HStack>
  );
};

export default Filters;
