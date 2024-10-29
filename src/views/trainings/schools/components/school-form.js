import { HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { states } from "helpers/addresses";
import { cityAccordingToState } from "helpers/addresses";
import { AuthContext } from "providers/auth";
import { CompanyContext } from "providers/company";

const schoolSchema = (isAdmin) =>
  Yup.object().shape({
    companyId: Yup.string()
      .notOneOf(["not-selected"], "Por favor, selecione uma empresa válida.")
      .when("isAdmin", {
        is: true,
        then: Yup.string().required("Campo obrigatório"),
      }),
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
  const [companyOptions, setCompanyOptions] = useState([]);
  const { userAccessRule, getUserInfo } = useContext(AuthContext);
  const { getCompanies } = useContext(CompanyContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schoolSchema(userAccessRule.isAdmin)) });

  const onSubmit = async (data) => {
    setLoading(true);
    if (!data.companyId) {
      data.companyId = getUserInfo().companyId;
    }

    if (event === "add") {
      const res = await onAdd(data);
      setLoading(false);
      onClose(res);
      return;
    }

    const res = await onEdit(data, id);
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
        defaultValue={
          formValues && formValues?.state
            ? {
                label: states.find(
                  (state) => state.initials === formValues.state
                ).state,
                value: formValues.state,
              }
            : {
                label: "Selecione um estado",
                value: "",
              }
        }
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
        {...register("companyId")}
        error={errors.companyId?.message}
        defaultValue={
          formValues && formValues.companyId
            ? {
                label: formValues.companyName,
                value: formValues.companyId,
              }
            : {
                label: "Selecione uma empresa",
                value: "",
              }
        }
        options={companyOptions}
        errors={errors.companyId}
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
        defaultValue={
          formValues && formValues.city
            ? {
                label: formValues.city,
                value: formValues.city,
              }
            : {
                label: "Selecione uma cidade",
                value: "",
              }
        }
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

    getCompanies("", 1, 10000).then((companies) => {
      setCompanyOptions(
        companies.map((company) => {
          return {
            label: company.name,
            value: company.id,
          };
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      {userAccessRule.isAdmin && companySelect}
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
