import { yupResolver } from "@hookform/resolvers/yup";
import { FormTextArea } from "components/components";
import React from "react";
import { useForm } from "react-hook-form";
import { feedSchema } from "./schema";

const FeedDescriptionForm = ({
  formRef,
  onClose,
  handleEdit,
  defaultValue,
  setIsLoading,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(feedSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await handleEdit(data);
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
        label={"Descrição"}
        {...register("text")}
        error={errors.text?.message}
        defaultValue={defaultValue}
      />
    </form>
  );
};

export default FeedDescriptionForm;
