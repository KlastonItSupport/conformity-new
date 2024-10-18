import { VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";

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

  const schoolSelect = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Escola* "}
        {...register("school")}
        error={errors.school?.message}
        options={[
          {
            label: "Escola 1",
            value: "Escola 1",
          },
          {
            label: "Escola 2",
            value: "Escola 2",
          },
          {
            label: "Escola 3",
            value: "Escola 3",
          },
          {
            label: "Escola 4",
            value: "Escola 4",
          },
          {
            label: "Escola 5",
            value: "Escola 5",
          },
          {
            label: "Escola 6",
            value: "Escola 6",
          },
          {
            label: "Escola 7",
            value: "Escola 7",
          },
          {
            label: "Escola 8",
            value: "Escola 8",
          },
          {
            label: "Escola 9",
            value: "Escola 9",
          },
          {
            label: "Escola 10",
            value: "Escola 10",
          },
        ]}
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
      {...register("validationMonths")}
      error={errors.validationMonths?.message}
      defaultValue={formValues?.validationMonths}
    />
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    if (event === "edit") {
      setValue("companyName", formValues.companyName);
      setValue("school", formValues.school);
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
      {schoolSelect}
      {trainingInput}
      {expirationMonth}
    </VStack>
  );
};

export default TrainingForm;
