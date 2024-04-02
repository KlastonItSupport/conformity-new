import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import addCompanySchema from "./schema";
import FormInput from "components/form-input/form-input";
import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import SelectInput from "components/select";

export const CompanyForm = ({ formRef }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    event = "addCompany",
  } = useForm({
    resolver: yupResolver(addCompanySchema),
  });
  const onSubmit = (data) => {
    if (event === "addcCompany") {
    }
  };
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });
  const contactAndEmail = [
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Contato"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Contato *"
      width="100%"
      {...register("contact")}
      error={errors.contact?.message}
    />,
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
      label="Email *"
      width="100%"
      {...register("email")}
      error={errors.email?.message}
    />,
  ];

  const cityAndNeighborhood = [
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
      label="Cidade *"
      width="100%"
      {...register("city")}
      error={errors.city?.message}
    />,
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
      label="Bairro *"
      width="100%"
      {...register("neighborhood")}
      error={errors.neighborhood?.message}
    />,
  ];

  const streetAndNumber = [
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
      label="Endereço *"
      width="100%"
      {...register("address")}
      error={errors.address?.message}
    />,
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
      label="Número *"
      width="100%"
      {...register("number")}
      error={errors.number?.message}
    />,
  ];

  const complementAndState = [
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
      label="Complemento *"
      width="100%"
      {...register("complement")}
      error={errors.complement?.message}
    />,
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
      label="Estado *"
      width="100%"
      {...register("state")}
      error={errors.state?.message}
    />,
  ];

  const spaceLimitAndUsersLimit = [
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
      label="Limite de espaço (MB) *"
      width="100%"
      {...register("name")}
      error={errors.name?.message}
    />,
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
      label="Limite de Usuários (Acesso) *"
      width="100%"
      {...register("name")}
      error={errors.name?.message}
    />,
  ];

  const statusAndLimitGeralUsers = [
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Nome"
      margin="0 0 0px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Limite de Usuários (Geral)*"
      width="100%"
      //   {...register("name")}
      //   error={errors.?.message}
    />,
    <VStack w={"100%"} align={"start"} justify={"start"} m={"0px"}>
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
      ,
    </VStack>,
  ];

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
      {!isDesktop && (
        <VStack>
          {[
            contactAndEmail,
            cityAndNeighborhood,
            streetAndNumber,
            complementAndState,
            spaceLimitAndUsersLimit,
            statusAndLimitGeralUsers,
          ]}{" "}
        </VStack>
      )}
      {isDesktop && (
        <>
          <HStack>{contactAndEmail}</HStack>
          <HStack>{cityAndNeighborhood}</HStack>
          <HStack>{streetAndNumber}</HStack>
          <HStack>{complementAndState}</HStack>
          <HStack>{spaceLimitAndUsersLimit}</HStack>
          <HStack>{statusAndLimitGeralUsers}</HStack>
        </>
      )}
    </form>
  );
};
