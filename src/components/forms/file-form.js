import { FormInput } from "components/components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
  id,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(extraDocumentsSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const fileTreated = await handlingMultipleFilesToBase64(data.documents);
    const res = await onSubmitForm({
      documents: fileTreated,
      id,
    });

    setIsLoading(false);
    onClose(res);
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
