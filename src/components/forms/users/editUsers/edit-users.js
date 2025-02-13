import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import { useForm } from "react-hook-form";
import editUsersFormSchema from "./schema";
import SelectInput from "components/select";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "providers/users";
import { CompanyContext } from "providers/company";
import { AuthContext } from "providers/auth";
import { useTranslation } from "react-i18next";
import { Center, Spinner } from "@chakra-ui/react";

export const EditUsersForm = ({ formRef, onCloseModal, formValues }) => {
  const { t } = useTranslation();
  const { editUser } = useContext(UserContext);
  const { getCompanies } = useContext(CompanyContext);
  const { user: currentUser } = useContext(AuthContext);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companiesIsLoading, setCompaniesIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editUsersFormSchema),
    defaultValues: {
      name: formValues.name,
      email: formValues.email,
      celphone: formValues.celphone,
      companyId: formValues.companyId,
      role: formValues.role,
      departament: formValues.departament,
      accessRule: formValues.accessRule,
      status: formValues.status,
    },
  });

  useEffect(() => {
    // Lock companyId field for non-super-admins
    if (currentUser.accessRule !== 'super-admin') {
      setValue('companyId', formValues.companyId);
    }
  }, [currentUser.accessRule, formValues.companyId, setValue]);

  const onSubmit = async (data) => {
    const userData = {
      ...data,
      id: formValues.id,
      companyId: data.companyId,
    };

    try {
      const response = await editUser(userData);
      if (response) {
        onCloseModal();
      }
    } catch (error) {
      console.error('Error updating user:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const fetchCompaniesData = async () => {
    try {
      setCompaniesIsLoading(true);
      const companies = await getCompanies();
      setCompanyOptions(
        companies.map(company => ({
          label: company.name,
          value: company.id
        }))
      );
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setCompaniesIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser.accessRule === 'super-admin') {
      fetchCompaniesData();
    }
  }, [currentUser.accessRule]);

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
        placeholder={t("Nome completo")}
        margin="0 0 10px 0"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Nome *")}
        width="100%"
        {...register("name")}
        error={errors.name?.message}
        defaultValue={formValues.name}
      />

      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="email"
        placeholder="emailexample@hotmail.com"
        margin="0 0 10px 0"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Email *"
        {...register("email")}
        error={errors.email?.message}
        defaultValue={formValues.email}
      />

      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="(xx) xxxx-xxxx"
        margin="0 0 10px 0"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Telefone *")}
        width="100%"
        {...register("celphone")}
        error={errors.celphone?.message}
        defaultValue={formValues.celphone}
      />

      {currentUser.accessRule === "super-admin" && (
        companiesIsLoading ? (
          <Center height="100px">
            <Spinner size="xl" />
          </Center>
        ) : (
          <SelectInput
            label={t("Empresa")}
            {...register("companyId")}
            control={control}
            options={companyOptions}
            placeholder={t("Selecione uma empresa")}
            defaultValue={{
              label: formValues.company?.name,
              value: formValues.companyId
            }}
            error={errors.companyId?.message}
            isOptional={true}
          />
        )
      )}

      <SelectInput
        label={t("Cargo")}
        {...register("role")}
        control={control}
        options={[
          { label: "TI", value: "1" },
          { label: "DP", value: "a" },
          { label: "RH", value: "3" },
        ]}
        error={errors.role?.message}
        defaultValue={formValues.role}
      />

      <SelectInput
        label={t("Departamento")}
        {...register("departament")}
        control={control}
        options={[
          { label: t("Qualidade"), value: "1" },
          { label: t("Compras"), value: "2" },
          { label: t("Administrativo"), value: "3" },
        ]}
        error={errors.departament?.message}
        defaultValue={formValues.departament}
      />

      <SelectInput
        label={t("Regra de acesso")}
        {...register("accessRule")}
        control={control}
        options={[
          { label: "Root", value: "root" },
          { label: t("Super Usuário"), value: "super-user" },
          { label: t("Usuário"), value: "user" },
        ]}
        error={errors.accessRule?.message}
        defaultValue={{
          label: formValues.accessRule === "root" ? "Root" : 
                 formValues.accessRule === "super-user" ? t("Super Usuário") : t("Usuário"),
          value: formValues.accessRule
        }}
      />

      <SelectInput
        label={t("Status")}
        {...register("status")}
        control={control}
        options={[
          { label: t("Ativo"), value: "active" },
          { label: t("Inativo"), value: "inactive" },
        ]}
        error={errors.status?.message}
        defaultValue={{
          label: formValues.status === "active" ? t("Ativo") : t("Inativo"),
          value: formValues.status
        }}
      />
    </form>
  );
};