import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { relatedDocsSchema } from "./schemas/related-docs.schema";
import SelectInput from "components/select";

const RelatedDocsForm = ({
  onClose,
  formRef,
  options,
  onConfirm,
  setLoading,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(relatedDocsSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await onConfirm(data);
    setLoading(false);
    onClose();
  };

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <SelectInput
        label="Nome do documento"
        options={options}
        placeholder="Selecione um Arquivo"
        {...register("documentSideId")}
        error={errors.documentSideId?.message}
      />
    </form>
  );
};

export default RelatedDocsForm;
