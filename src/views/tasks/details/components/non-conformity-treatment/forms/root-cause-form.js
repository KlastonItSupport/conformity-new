import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";
import * as Yup from "yup";
import { FormTextArea } from "components/components";

export const schema = Yup.object().shape({
  rootCause: Yup.string().required("Causa raiz obrigatória"),
});

const RootCauseForm = ({ formRef, onClose, setIsLoading, formValues }) => {
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
      <FormTextArea
        label={"Causa raiz teste"}
        {...register("rootCause")}
        error={errors.rootCause?.message}
        defaultValue={formValues?.rootCause}
      />{" "}
    </form>
  );
};

export default RootCauseForm;
