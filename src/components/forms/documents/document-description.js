import { yupResolver } from "@hookform/resolvers/yup";
import { FormTextArea } from "components/components";
import React from "react";
import { useForm } from "react-hook-form";
import { documentDescriptionSchema } from "./schemas/description.schema";

const DocumentDescriptionForm = ({ formRef, onClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(documentDescriptionSchema),
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
      <FormTextArea
        label={"Descrição do documento"}
        {...register("description")}
        error={errors.description?.message}
      />
    </form>
  );
};

export default DocumentDescriptionForm;
