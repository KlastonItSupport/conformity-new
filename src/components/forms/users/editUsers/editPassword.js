import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import { useForm } from "react-hook-form";
import editUsersFormSchema from "./schema";

export const EditUsersPasswordForm = ({ formRef }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editUsersFormSchema),
  });

  const onSubmit = (data) => {
    console.log("abassdasdsa", data);
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
        type="text"
        placeholder="Nova Senha"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Nova Senha *"
        width="100%"
        {...register("password")}
        error={errors.password?.message}
      />
    </form>
  );
};
