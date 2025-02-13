import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { AuthContext } from "providers/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "components/form-input/form-input";
import { ButtonPrimary } from "components/button-primary";
import { useTranslation } from "react-i18next";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
});

export const ForgotPasswordForm = () => {
  const { forgotPassword } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const handleForgotPassword = async (data) => {
    try {
      setIsLoading(true);
      // 1. Enviar email al backend
      const success = await forgotPassword(data.email); 
      
      if (success) {
        // 2. Mostrar feedback y redireccionar
        setEmailSent(true);
        setTimeout(() => navigate("/signin"), 3000);
      }
    } catch (error) {
      // 3. Manejo de errores (implementado en AuthContext)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      flexDirection="column"
      mt={"15vh"}
      w={{ lg: "50%", md: "90%", sm: "90%" }}
    >
      <VStack alignItems={{ lg: "normal", sm: "start", md: "start" }}>
        <Heading
          fontSize={{ lg: "36px", md: "32px", sm: "24px" }}
          color={useColorModeValue("navy.700", "white")}
        >
          {t("Recuperar Senha")}
        </Heading>
        <Text
          mb="36px"
          ms="4px"
          color={emailSent ? "green.500" : "gray.600"}
          fontWeight="400"
          fontSize="md"
        >
          {emailSent
            ? t("Email de recuperação enviado! Verifique sua caixa de entrada.")
            : t("Insira seu email para receber instruções de recuperação")}
        </Text>
      </VStack>

      <Flex
        direction="column"
        w={{ base: "100%", md: "420px" }}
        maxW="100%"
        background="transparent"
        borderRadius="15px"
        mx={{ base: "auto", lg: "unset" }}
        me="auto"
      >
        <form onSubmit={handleSubmit(handleForgotPassword)}>
          <FormInput
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="email"
            placeholder="emailexample@hotmail.com"
            margin="0 0 24px 0"
            fontWeight="500"
            size="lg"
            borderRadius="6px"
            bgColor={"primary.50"}
            {...register("email")}
            error={errors.email?.message}
            label="Email *"
            isDisabled={emailSent}
          />

          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            w="100%"
            h="50"
            mb="24px"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            type="submit"
            isLoading={isLoading}
            isDisabled={emailSent}
            label={t("Enviar")}
          />
          
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            w="100%"
            h="50"
            variant="outline"
            onClick={() => navigate("/signin")}
            label={t("Voltar ao Login")}
          />
        </form>
      </Flex>
    </Flex>
  );
};