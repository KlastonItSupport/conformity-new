import { yupResolver } from "@hookform/resolvers/yup";
import { FormTextArea } from "components/components";
import React from "react";
import { useForm } from "react-hook-form";
import { feedSchema } from "./schema";

const FeedDescriptionForm = ({ formRef, onClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(feedSchema),
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
        label={"Descrição"}
        {...register("description")}
        error={errors.description?.message}
      />
    </form>
  );
};

export default FeedDescriptionForm;
