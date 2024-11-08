import { VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { SchoolContext } from "providers/schools";
import { AuthContext } from "providers/auth";
import { CompanyContext } from "providers/company";

const trainingSchema = (isAdmin) =>
  Yup.object().shape({
    schoolId: Yup.string().notOneOf(
      [""],
      "Por favor, selecione uma escola válida."
    ),
    companyId: Yup.string()
      .notOneOf([""], "Por favor, selecione uma empresa válida.")
      .when("isAdmin", {
        is: true,
        then: Yup.string().required("Campo obrigatório"),
      }),

    name: Yup.string().required("Campo obrigatório"),
  });

const TrainingForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const [schoolsOptions, setSchoolsOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const { getSchools } = useContext(SchoolContext);
  const { userAccessRule } = useContext(AuthContext);
  const { getCompanies } = useContext(CompanyContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(trainingSchema(userAccessRule.isAdmin)),
  });

  const onSubmit = async (data) => {
    setLoading(true);

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

  const schoolSelect = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Escola* "}
        {...register("schoolId")}
        error={errors.schoolId?.message}
        defaultValue={
          formValues && formValues.schoolId
            ? {
                label: formValues.schoolName,
                value: formValues.schoolId,
              }
            : {
                label: "Selecione uma escola",
                value: "",
              }
        }
        options={schoolsOptions}
        errors={errors.schoolId}
      />
    </VStack>
  );

  const companySelect = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Empresa"}
        {...register("companyId")}
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

  const trainingInput = (
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
      label="Nome do treinamento:"
      width="100%"
      {...register("name")}
      error={errors.name?.message}
      defaultValue={formValues?.name}
    />
  );

  const expirationMonth = (
    <FormInput
      variant="auth"
      fontSize="sm"
      type="text"
      placeholder="EX: 7"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Validade em meses"
      width="100%"
      {...register("expirationInMonths")}
      error={errors.expirationInMonths?.message}
      defaultValue={formValues?.expirationInMonths}
    />
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    getSchools(1, "", 10000).then((schools) => {
      setSchoolsOptions(
        schools.items.map((school) => {
          return {
            label: school.name,
            value: school.id,
          };
        })
      );
    });

    getCompanies(1, "", 10000).then((companies) => {
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
      {schoolSelect}
      {trainingInput}
      {expirationMonth}
    </VStack>
  );
};

export default TrainingForm;
