import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { departamentSchema } from "./schemas/create-departament.schema";
import { FormInput } from "components/components";
import { DepartamentContext } from "providers/departament";

const DepartamentForm = ({ formRef, onClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departamentSchema),
  });

  const { createDepartament, setCreateDepartamentIsLoading } =
    useContext(DepartamentContext);

  const onSubmit = async (data) => {
    setCreateDepartamentIsLoading(true);
    await createDepartament(data);
    setCreateDepartamentIsLoading(false);
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
