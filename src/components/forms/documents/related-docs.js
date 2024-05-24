import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { relatedDocsSchema } from "./schemas/related-docs.schema";
import SelectInput from "components/select";

const RelatedDocsForm = ({ onClose, formRef }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(relatedDocsSchema),
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
      <SelectInput
        label="Nome do documento"
        options={[
          {
            label: "teste.pdf",
            value: "1",
          },
          {
            label: "orçamento-iso-9001.pdf",
            value: "2",
          },
        ]}
        placeholder="Selecione um Arquivo"
        defaultValue={{
          label: "Selecione um arquivo",
          value: "none-archive-participant",
        }}
        {...register("file")}
        error={errors.file?.message}
      />
    </form>
  );
};

export default RelatedDocsForm;
