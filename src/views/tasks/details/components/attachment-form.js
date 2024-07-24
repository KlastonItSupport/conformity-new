import { FormInput } from "components/components";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import { handlingMultipleFilesToBase64 } from "helpers/buffer-to-base-64";
import * as Yup from "yup";

export const extraDocumentsSchema = Yup.object().shape({
  documents: Yup.mixed(),
});

const AttachmentForm = ({ formRef, onClose, setIsLoading }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(extraDocumentsSchema),
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const fileTreated = await handlingMultipleFilesToBase64(data.documents);

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
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="file"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Insira seus anexos"}
        {...register("documents")}
        multiple
        className="center-file-input"
        error={errors.documents?.message}
      />
    </form>
  );
};

export default AttachmentForm;
