import { HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { ButtonPrimary } from "components/button-primary";
import { FormInput } from "components/components";
import { FormTextArea } from "components/components";
import { api } from "api/api";
import { toast } from "react-toastify";
import { handlingMultipleFilesToBase64 } from "helpers/buffer-to-base-64";

const supportSchema = Yup.object().shape({
  subject: Yup.string().required("Campo obrigatório"),
  userName: Yup.string().required("Campo obrigatório"),
  userEmail: Yup.string().required("Campo obrigatório"),
  issueDepartment: Yup.string().required("Campo obrigatório"),
  priority: Yup.string().required("Campo obrigatório"),
  description: Yup.string().required("Campo obrigatório"),
  documents: Yup.mixed(),
});

const SupportForm = ({ formRef }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(supportSchema) });

  const createSupportCase = async (data) => {
    const response = await api.post("/support", data);

    if (response.status === 201) {
      toast.success("O suporte foi enviado com sucesso!");
    }
    return response;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const attachments = await handlingMultipleFilesToBase64(data.attachments);

    const attachmentsMapped = attachments.map((attachment) => ({
      filename: attachment.name,
      contentType: attachment.type,
      content: attachment.base,
      encoding: "base64",
    }));

    await createSupportCase({ ...data, attachments: attachmentsMapped });

    setIsLoading(false);
  };

  const topicInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Ex: Não sei criar um usuário"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      {...register("subject")}
      error={errors.subject?.message}
      label="Assunto"
    />
  );

  const nameInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Ex: Bruno Santos"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      {...register("userName")}
      error={errors.userName?.message}
      label="Seu nome"
    />
  );

  const emailInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Ex: meuemail@klaston.com"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      {...register("userEmail")}
      error={errors.userEmail?.message}
      label="Endereço de e-mail"
    />
  );

  const department = (
    <SelectInput
      label="Departamento"
      {...register("issueDepartment")}
      errors={errors.issueDepartment}
      paddingLabel={"0"}
      defaultValue={{
        label: "Suporte técnico",
        value: "Suporte técnico",
      }}
      options={[
        {
          label: "Suporte técnico",
          value: "Suporte técnico",
        },
        {
          label: "Comercial",
          value: "Comercial",
        },
      ]}
    />
  );

  const priority = (
    <SelectInput
      mb="20px"
      label="Prioridade"
      {...register("priority")}
      errors={errors.priority}
      paddingLabel={"0"}
      defaultValue={{
        label: "Baixa",
        value: "Baixa",
      }}
      options={[
        {
          label: "Baixa",
          value: "Baixa",
        },
        {
          label: "Média",
          value: "Média",
        },
        {
          label: "Alta",
          value: "Alta",
        },
      ]}
    />
  );

  const description = (
    <FormTextArea
      label={"Descrição * "}
      {...register("description")}
      placeholder="Descreva em todos os detalhes possíveis o seu problema"
      error={errors.description?.message}
      height={"125px"}
    />
  );

  const attachmentsInput = (
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
      label={"Insira anexos "}
      {...register("attachments")}
      multiple={true}
      className="center-file-input"
      error={errors.attachments?.message}
    />
  );

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
      backgroundColor={"white"}
      border={"1px solid #E0E0E0"}
      padding={"20px"}
      borderRadius={"6px"}
    >
      {topicInput}
      {nameInput}
      {emailInput}
      {department}
      {priority}
      {attachmentsInput}
      {description}

      <HStack w={"100%"} justifyContent={"center"}>
        <ButtonPrimary
          fontSize="sm"
          fontWeight="bold"
          h="50"
          bgColor={"primary.100"}
          _hover={{ bgColor: "primary.200" }}
          textColor={"white"}
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
          borderRadius="7px"
          _active={{ bgColor: "primary.200" }}
          label={"Gerar Solicitação"}
          type="submit"
          width="150px"
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  );
};

export default SupportForm;
