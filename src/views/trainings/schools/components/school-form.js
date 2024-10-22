import { HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { states } from "helpers/addresses";
import { cityAccordingToState } from "helpers/addresses";

const contractSchema = Yup.object().shape({
  title: Yup.string(),
  status: Yup.string(),
  crmCompanyId: Yup.string(),
  startDate: Yup.string(),
  endDate: Yup.string(),
  value: Yup.string(),
  description: Yup.string(),
  contract: Yup.string(),
  solicitationMonth: Yup.string(),
  solicitationYear: Yup.string(),
});

const SchoolForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const [statesOptions, setStatesOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(contractSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      const res = await onAdd(data);
      setLoading(false);
      onClose(res);
      return;
    }

    const res = await onEdit(id, data);

    setLoading(false);
    onClose(res);
  };

  const stateInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Estado"}
        {...register("state")}
        error={errors.state?.message}
        options={statesOptions}
        onChange={(e) => {
          const stateInput = e.target.value;

          const citiesFromThisState = cityAccordingToState.estados.find(
            (state) => state.sigla === stateInput
          );

          if (citiesFromThisState) {
            setCityOptions(
              citiesFromThisState.cidades.map((city) => {
                return {
                  label: city,
                  value: city,
                };
              })
            );
          }
        }}
      />
    </VStack>
  );

  const companySelect = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Empresa"}
        {...register("companyName")}
        error={errors.companyName?.message}
        options={[
          {
            label: "Empresa 1",
            value: "Empresa 1",
          },
          {
            label: "Empresa 2",
            value: "Empresa 2",
          },
          {
            label: "Empresa 3",
            value: "Empresa 3",
          },
          {
            label: "Empresa 4",
            value: "Empresa 4",
          },
          {
            label: "Empresa 5",
            value: "Empresa 5",
          },
          {
            label: "Empresa 6",
            value: "Empresa 6",
          },
          {
            label: "Empresa 7",
            value: "Empresa 7",
          },
          {
            label: "Empresa 8",
            value: "Empresa 8",
          },
          {
            label: "Empresa 9",
            value: "Empresa 9",
          },
          {
            label: "Empresa 10",
            value: "Empresa 10",
          },
        ]}
      />
    </VStack>
  );

  const schoolNameInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      type="text"
      placeholder="EX: Treinamento de capacitação"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Nome da Escola"
      width="100%"
      {...register("name")}
      error={errors.name?.message}
      defaultValue={formValues?.name}
    />
  );

  const emailInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      type="text"
      placeholder="EX: Treinamento de capacitação"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Email"
      width="100%"
      {...register("email")}
      error={errors.email?.message}
      defaultValue={formValues?.email}
    />
  );

  const celphoneInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      type="text"
      placeholder="EX: (99)99999-9999"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Telefone"
      width="100%"
      {...register("celphone")}
      error={errors.celphone?.message}
      defaultValue={formValues?.celphone}
    />
  );

  const cityInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Cidade"}
        {...register("city")}
        error={errors.city?.message}
        options={cityOptions}
      />
    </VStack>
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setStatesOptions([
      { label: "Selecione um estado", value: "" },
      ...states.map((state) => {
        return {
          label: state.state,
          value: state.initials,
        };
      }),
    ]);

    if (event === "edit") {
      setValue();
    }
  }, []);

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      {companySelect}
      {schoolNameInput}
      {emailInput}
      {celphoneInput}
      <HStack w={"100%"}>
        {stateInput}
        {cityInput}
      </HStack>
    </VStack>
  );
};

export default SchoolForm;
