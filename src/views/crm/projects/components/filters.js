import { HStack, VStack } from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import SelectInput from "components/select";
import { useBreakpoint } from "hooks/usebreakpoint";
import { CrmContext } from "providers/crm";
import { ProjectContext } from "providers/projects";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export const filtersSchema = Yup.object().shape({
  status: Yup.string(),
  clientSupplier: Yup.string(),
});

const Filters = ({ onSearch }) => {
  const { isMobile } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);
  const { getCrm } = useContext(CrmContext);
  const { getProjects } = useContext(ProjectContext);
  const [clientTypeOptions, setClientTypeOptions] = useState([]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm(filtersSchema);

  const clientSupplier = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Cliente / Fornecedor"
        {...register("clientSupplier")}
        errors={errors.clientSupplier}
        defaultValue={{
          label: "Selecione um Cliente/Fornecedor",
          value: "not-selected",
        }}
        options={clientTypeOptions}
      />
    </VStack>
  );

  const status = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Status "
        {...register("status")}
        errors={errors.status}
        defaultValue={{
          label: "Selecione um status",
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
    setIsLoading(true);

    const res = await getProjects(1, "", data);
    onSearch(res.items, res.pages);

    setIsLoading(false);
  };

  useEffect(() => {
    getCrm(10000, "").then((crm) => {
      const options = crm.items.map((item) => {
        return { label: item.socialReason, value: item.id };
      });
      setClientTypeOptions(options);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isMobile ? (
    <VStack
      w={"100%"}
      paddingX={"20px"}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {clientSupplier}
      {status}

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
      {status}

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
