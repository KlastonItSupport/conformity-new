import { FormInput } from "components/components";
import React from "react";
import { extraDocumentsSchema } from "./schemas/extras-documents.schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ExtrasDocuments = ({ formRef, onClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(extraDocumentsSchema),
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
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="file"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Insira sua foto"}
        {...register("profilePic")}
        className="center-file-input"
        error={errors.profilePic?.message}
      />
    </form>
  );
};

export default ExtrasDocuments;
