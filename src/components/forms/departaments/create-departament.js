import { yupResolver } from "@hookform/resolvers/yup";

import React from "react";
import { useForm } from "react-hook-form";
import { departamentSchema } from "./schemas/create-departament.schema";
import { FormInput } from "components/components";

const DepartamentForm = ({ formRef, onClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departamentSchema),
  });

  const onSubmit = async (data) => {
    onClose();
  };

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormInput
        label={"Nome * "}
        {...register("name")}
        error={errors.name?.message}
      />
    </form>
  );
};

export default DepartamentForm;
