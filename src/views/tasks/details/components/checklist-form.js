import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormInput } from "components/components";

export const schema = Yup.object().shape({
  name: Yup.string().required("Nome obrigatório"),
});

const ChecklistForm = ({
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
      <FormInput
        label={"Nome"}
        {...register("name")}
        error={errors.name?.message}
        defaultValue={formValues?.name}
      />{" "}
    </form>
  );
};

export default ChecklistForm;
