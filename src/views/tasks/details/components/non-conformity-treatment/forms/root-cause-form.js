import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormTextArea } from "components/components";

export const schema = Yup.object().shape({
  rootCause: Yup.string().required("Causa raiz obrigatória"),
});

const RootCauseForm = ({
  formRef,
  onClose,
  setIsLoading,
  formValues,
  onAdd,
  onEdit,
  event = "add",
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
    if (event === "edit") {
      await onEdit(data);
      setIsLoading(false);
      onClose();
      return;
    }
    await onAdd(data);
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
