import { FormInput } from "components/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import { handlingMultipleFilesToBase64 } from "helpers/buffer-to-base-64";
import * as Yup from "yup";

export const extraDocumentsSchema = Yup.object().shape({
  documents: Yup.mixed(),
});

const FileForm = ({
  formRef,
  onClose,
  setIsLoading,
  onSubmitForm,
  label,
  acceptMultipleFiles = true,
}) => {
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
    await onSubmitForm({
      documents: fileTreated,
      id: queryParams.get("id"),
    });

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
        label={label ?? "Insira seus documentos"}
        {...register("documents")}
        multiple={acceptMultipleFiles}
        className="center-file-input"
        error={errors.documents?.message}
      />
    </form>
  );
};

export default FileForm;
