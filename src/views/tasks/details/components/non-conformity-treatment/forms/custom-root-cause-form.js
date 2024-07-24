import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";
import * as Yup from "yup";
import { FormInput } from "components/components";

export const schema = Yup.object().shape({
  why: Yup.string().required("Obrigatório"),
  answer: Yup.string().required("Obrigatório"),
});

const CustomRootCauseForm = ({
  formRef,
  onClose,
  setIsLoading,
  formValues,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await sleep(250);
    setIsLoading(false);
    onClose();
  };
  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormInput
        label={"Por que?"}
        {...register("why")}
        error={errors.why?.message}
        defaultValue={formValues?.why}
      />{" "}
      <FormInput
        label={"Resposta"}
        {...register("answer")}
        error={errors.answer?.message}
        defaultValue={formValues?.answer}
      />
    </form>
  );
};

export default CustomRootCauseForm;
