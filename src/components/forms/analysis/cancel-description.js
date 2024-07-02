import { yupResolver } from "@hookform/resolvers/yup";

import React from "react";
import { useForm } from "react-hook-form";
import { FormTextArea } from "components/components";

import * as Yup from "yup";

export const schema = Yup.object().shape({
  description: Yup.string().required("Nome  obrigatório"),
});

const CancelDescription = ({ formRef, onClose, setLoading, onConfirm }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await onConfirm(data);
    setLoading(false);
    onClose(response);
    return;
  };

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormTextArea
        label={"Descrição * "}
        {...register("description")}
        error={errors.description?.message}
      />
    </form>
  );
};

export default CancelDescription;
