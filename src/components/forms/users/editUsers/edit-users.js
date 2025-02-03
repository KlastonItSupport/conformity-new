import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import { useForm } from "react-hook-form";
import editUsersFormSchema from "./schema";
import SelectInput from "components/select";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "providers/users";
import { CompanyContext } from "providers/company";
import { useTranslation } from "react-i18next";
import { Center, Spinner } from "@chakra-ui/react";

export const EditUsersForm = ({ formRef, onCloseModal, formValues }) => {
  const { t } = useTranslation();
  const { editUser } = useContext(UserContext);
  const { getCompanies } = useContext(CompanyContext);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companiesIsLoading, setCompaniesIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editUsersFormSchema),
    defaultValues: {
      name: formValues.name,
      email: formValues.email,
      celphone: formValues.celphone,
      companyId: formValues.companyId, // Ensure companyId is included
      role: formValues.role,
      departament: formValues.departament,
      accessRule: formValues.accessRule,
      status: formValues.status,
    },
  });

  const onSubmit = async (data) => {
    const userData = {
      ...data,
      id: formValues.id,
      companyId: data.companyId,
    };
  
    console.log('Original Company ID:', formValues.companyId);
    console.log('New Company ID:', data.companyId);
    console.log('Full User Data:', userData);
  
    try {
      const response = await editUser(userData);
      console.log('Full API Response:', response);
      
      if (response) {
        onCloseModal();
      }
    } catch (error) {
      console.error('Error Details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const getAccessDefaultValue = () => {
    if (formValues.accessRule === "root") {
      return { label: "root", value: "root" };
    }
    if (formValues.accessRule === "super-user") {
      return { label: "Super Usuário", value: "super-user" };
    }
    return { label: "Usuário", value: "user" };
  };

  const fetchCompaniesData = async () => {
    try {
      setCompaniesIsLoading(true);
      const companies = await getCompanies();
      setCompanyOptions(
        companies.map((company) => ({ label: company.name, value: company.id }))
      );
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setCompaniesIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        label={t("Nome *")}
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
        label={t("Telefone *")}
        width="100%"
        defaultValue={formValues.celphone}
        {...register("celphone")}
        error={errors.celphone?.message}
      />

{companiesIsLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <SelectInput
        label={t("Empresa *")}
        {...register("companyId")}
        errors={errors.companyId}
        options={companyOptions}
        placeholder={t("Selecione uma empresa")}
        defaultValue={{
          label: formValues.company?.name,
          value: formValues.companyId
        }}
      />
      )}


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
        label={t("Departamento")}
        options={[
          { label: "Qualidade", value: "1" },
          { label: "Compras", value: "2" },
          { label: "Admin", value: "3" },
        ]}
        {...register("departament")}
      />

      <SelectInput
        errors={errors.accessRule}
        label={t("Regra de acesso")}
        {...register("accessRule")}
        defaultValue={getAccessDefaultValue()}
        options={[
          { label: "root", value: "root" },
          { label: "Super Usuário", value: "super-user" },
          { label: "Usuário", value: "user" },
        ]}
      />

      <SelectInput
        {...register("status")}
        label="Status"
        errors={errors.status}
        defaultValue={{
          label: formValues.status === "active" ? t("Ativo") : t("Inativo"),
          value: formValues.status,
        }}
        options={[
          {
            label: t("Ativo"),
            value: "active",
          },
          {
            label: t("Inativo"),
            value: "inactive",
          },
        ]}
      />

      
    </form>
  );
};
