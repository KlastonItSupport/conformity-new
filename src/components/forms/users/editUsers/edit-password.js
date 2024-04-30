import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import { useForm } from "react-hook-form";
import { editPasswordSchema } from "./schema";
import { useTranslation } from "react-i18next";

export const EditUsersPasswordForm = ({ formRef, onEdit, onCloseModal }) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editPasswordSchema),
  });

  const onSubmit = async (data) => {
    await onEdit(data.password);
    await onCloseModal();
  };
  return (
    <form
      style={{ width: "100%" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="password"
        placeholder="Password!23"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Nova Senha *")}
        width="100%"
        {...register("password")}
        error={errors.password?.message}
      />
    </form>
  );
};
