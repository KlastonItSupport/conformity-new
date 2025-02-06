import { Box, HStack, VStack } from "@chakra-ui/react";
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(supportSchema) });

  const createSupportCase = async (data) => {
    const response = await api.post("/support", data);

    if (response.status === 201) {
      toast.success(t("O suporte foi enviado com sucesso!"));
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
    <Box flex={1} h="85px">
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder={t("Ex: Não sei criar um usuário")}
        fontWeight="500"
        size="lg"
        h="45px"
        borderRadius="7px"
        bgColor="primary.50"
        {...register("subject")}
        error={errors.subject?.message}
        label={t("Assunto")}
      />
    </Box>
  );

  const nameInput = (
    <Box flex={1} h="85px">
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder={t("Ex: Bruno Santos")}
        fontWeight="500"
        size="lg"
        h="45px"
        borderRadius="7px"
        bgColor="primary.50"
        {...register("userName")}
        error={errors.userName?.message}
        label={t("Seu nome")}
      />
    </Box>
  );

  const emailInput = (
    <Box flex={1} h="85px">
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder={t("Ex: meuemail@klaston.com")}
        fontWeight="500"
        size="lg"
        h="45px"
        borderRadius="7px"
        bgColor="primary.50"
        {...register("userEmail")}
        error={errors.userEmail?.message}
        label={t("Endereço de e-mail")}
      />
    </Box>
  );

  const department = (
    <Box flex={1} h="85px">
      <SelectInput
        label={t("Departamento")}
        {...register("issueDepartment")}
        errors={errors.issueDepartment}
        defaultValue={{
          label: t("Suporte técnico"),
          value: "Suporte técnico",
        }}
        options={[
          {
            label: t("Suporte técnico"),
            value: "Suporte técnico",
          },
          {
            label: t("Comercial"),
            value: "Comercial",
          },
        ]}
        size="lg"
        bgColor="primary.50"
        h="45px"
        borderRadius="7px"
      />
    </Box>
  );

  const priority = (
    <Box flex={1} h="85px">
      <SelectInput
        label={t("Prioridade")}
        {...register("priority")}
        errors={errors.priority}
        defaultValue={{
          label: t("Baixa"),
          value: "Baixa",
        }}
        options={[
          {
            label: t("Baixa"),
            value: "Baixa",
          },
          {
            label: t("Média"),
            value: "Média",
          },
          {
            label: t("Alta"),
            value: "Alta",
          },
        ]}
        size="lg"
        bgColor="primary.50"
        h="45px"
        borderRadius="7px"
      />
    </Box>
  );

  const description = (
    <Box w="100%" mb={4}>
      <FormTextArea
        label={t("Descrição *")}
        {...register("description")}
        placeholder={t("Descreva em todos os detalhes possíveis o seu problema")}
        error={errors.description?.message}
        height="125px"
        borderRadius="7px"
        bgColor="primary.50"
      />
    </Box>
  );

  const attachmentsInput = (
    <Box flex={1} h="85px">
      <FormInput
        variant="auth"
        fontSize="sm"
        type="file"
        fontWeight="500"
        size="lg"
        h="45px"
        borderRadius="7px"
        bgColor="primary.50"
        label={t("Insira anexos")}
        {...register("attachments")}
        multiple={true}
        className="center-file-input"
        error={errors.attachments?.message}
      />
    </Box>
  );

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w="100%"
      spacing={3}
      align="stretch"
    >
      <HStack spacing={4} align="flex-start">
        {topicInput}
        {nameInput}
      </HStack>
      
      <HStack spacing={4} align="flex-start">
        {emailInput}
        {department}
      </HStack>
      
      <HStack spacing={4} align="flex-start">
        {priority}
        {attachmentsInput}
      </HStack>

      {description}

      <Box>
        <ButtonPrimary
          fontSize="sm"
          fontWeight="bold"
          h="40px"
          bgColor="header.100"
          _hover={{ bgColor: "primary.200" }}
          textColor="white"
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
          borderRadius="7px"
          _active={{ bgColor: "primary.200" }}
          label={t("Gerar Solicitação")}
          type="submit"
          width="150px"
          isLoading={isLoading}
        />
      </Box>
    </VStack>
  );
};

export default SupportForm;
