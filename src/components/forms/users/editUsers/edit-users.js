import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import { useForm } from "react-hook-form";
import editUsersFormSchema from "./schema";
import SelectInput from "components/select";
import { useContext } from "react";
import { UserContext } from "providers/users";

export const EditUsersForm = ({ formRef, onCloseModal, formValues }) => {
  const { editUser } = useContext(UserContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editUsersFormSchema),
  });

  const onSubmit = async (data) => {
    await editUser(data);
    onCloseModal();
  };

  const getAccessDefaultValue = () => {
    if (formValues.accessRule === "super-admin") {
      return { label: "Super Admin", value: "super-admin" };
    }
    if (formValues.accessRule === "super-user") {
      return { label: "Super Usuário", value: "super-user" };
    }
    return { label: "Usuário", value: "user" };
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
        defaultValue={formValues.name}
        {...register("name")}
        error={errors.name?.message}
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
        defaultValue={formValues.email}
        {...register("email")}
        error={errors.email?.message}
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
        defaultValue={formValues.celphone}
        {...register("celphone")}
        error={errors.celphone?.message}
      />
      <SelectInput
        error={errors.role}
        options={[
          { label: "TI", value: "1" },
          { label: "DP", value: "a" },
          { label: "RH", value: "3" },
        ]}
        {...register("role")}
      />
      <SelectInput
        errors={errors.departament}
        label="Departamento"
        options={[
          { label: "Qualidade", value: "1" },
          { label: "Compras", value: "2" },
          { label: "Admin", value: "3" },
        ]}
        {...register("departament")}
      />

      <SelectInput
        errors={errors.accessRule}
        label="Regra de acesso"
        {...register("accessRule")}
        defaultValue={getAccessDefaultValue()}
        options={[
          { label: "Super Admin", value: "super-admin" },
          { label: "Super Usuário", value: "super-user" },
          { label: "Usuário", value: "user" },
        ]}
      />

      <SelectInput
        {...register("status")}
        label="Status"
        errors={errors.status}
        defaultValue={{
          label: formValues.status === "active" ? "Ativo" : "Inativo",
          value: formValues.status,
        }}
        options={[
          {
            label: "Ativo",
            value: "active",
          },
          {
            label: "Inativo",
            value: "inactive",
          },
        ]}
      />
    </form>
  );
};
