import { VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";
import React from "react";
import { useForm } from "react-hook-form";

const ActionForm = ({ formValues, formRef }) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      <FormInput
        label={"Tipo * "}
        {...register("type")}
        error={errors.type?.message}
        defaultValue={formValues?.type}
      />
      <FormInput
        label={"Validade "}
        {...register("validity")}
        error={errors.validity?.message}
        defaultValue={formValues?.validity}
      />

      <FormInput
        label={"Data de ação * "}
        {...register("actionDate")}
        error={errors.actionDate?.message}
        defaultValue={formValues?.actionDate}
      />
      <FormInput
        label={"Data da próxima ação * "}
        {...register("nextAction")}
        error={errors.nextAction?.message}
        defaultValue={formValues?.nextAction}
      />
    </VStack>
  );
};

export default ActionForm;
