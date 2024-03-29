import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import { useForm } from "react-hook-form";
import editUsersFormSchema from "./schema";
import SelectInput from "components/select";

export const AddUserForm = ({ formRef }) => {
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
        placeholder="Nome"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Nome *"
        width="100%"
        {...register("name")}
        error={errors.name?.message}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="(xx) xxxx-xxxx"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Telefone *"
        width="100%"
        {...register("celphone")}
        error={errors.celphone?.message}
      />
      <SelectInput
        label="Cargo"
        error={errors.role}
        options={[
          { label: "TI", value: "1" },
          { label: "DP", value: "a" },
          { label: "RH", value: "3" },
        ]}
        {...register("role")}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="email"
        placeholder="emailexample@hotmail.com"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Email *"
        {...register("email")}
        error={errors.email?.message}
      />
      <SelectInput
        label="Departamento"
        errors={errors.departament}
        options={[
          { label: "Qualidade", value: "1" },
          { label: "Compras", value: "2" },
          { label: "Admin", value: "3" },
        ]}
        {...register("departament")}
      />

      <SelectInput
        label="Regra de acesso"
        errors={errors.accessRule}
        {...register("accessRule")}
        options={[
          { label: "Super Admin", value: "option1" },
          { label: "Super Usuário", value: "option2" },
          { label: "Usuário", value: "3" },
        ]}
      />

      <SelectInput
        label="Status"
        {...register("status")}
        errors={errors.status}
        options={[
          {
            label: "Ativo",
            value: "1",
          },
          {
            label: "Inativo",
            value: "aaa",
          },
        ]}
      />
    </form>
  );
};
