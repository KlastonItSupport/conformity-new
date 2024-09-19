import { HStack, VStack } from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import SelectInput from "components/select";
import { notSelectedCleaning } from "helpers/not-selected-cleaning";
import { useBreakpoint } from "hooks/usebreakpoint";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export const filtersSchema = Yup.object().shape({
  origin: Yup.string(),
  type: Yup.string(),
  classification: Yup.string(),
  status: Yup.string(),
  departament: Yup.string(),
});

const Filters = () => {
  const { isMobile } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm(filtersSchema);

  useEffect(() => {
    // setFormDefaultValues(queryParams);
  }, []);

  const clientSupplier = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Cliente / Fornecedor"
        {...register("status")}
        errors={errors.status}
        defaultValue={{
          label: "Selecione um status",
          value: "not-selected",
        }}
        options={[
          {
            label: "Aberta",
            value: "Aberta",
          },
          {
            label: "Fechada",
            value: "Fechada",
          },
          {
            label: "Reaberta",
            value: "Reaberta",
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
            label: "Iniciado",
            value: "iniciado",
          },
          {
            label: "Parado",
            value: "parado",
          },
          {
            label: "Finalizado",
            value: "finalizado",
          },
          {
            label: "Em andamento",
            value: "em-andamento",
          },
        ]}
      />
    </VStack>
  );

  const onSubmit = async (data) => {
    notSelectedCleaning(data);
    setIsLoading(true);

    // const tasks = await getTasks(1, "", data);

    // setTasks(tasks.items);
    setIsLoading(false);
  };
  return isMobile ? (
    <VStack w={"100%"} paddingX={"20px"} as="form">
      {clientSupplier}
      {originInput}

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
      {clientSupplier}
      {originInput}

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
        isLoading={isLoading}
      />
    </HStack>
  );
};

export default Filters;
