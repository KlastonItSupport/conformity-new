import React, { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Flex, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { AuthContext } from "providers/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "components/form-input/form-input";
import { ButtonPrimary } from "components/button-primary";
import { useTranslation } from "react-i18next";

const resetPasswordSchema = yup.object().shape({
  password: yup.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], "Senhas não conferem")
    .required("Confirmação de senha é obrigatória")
});

export const ResetPasswordForm = () => {
  const { resetPassword } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const handleResetPassword = async (data) => {
    try {
      setIsLoading(true);
      const token = searchParams.get('token');
      const success = await resetPassword(token, data.password);
      if (success) {
        navigate("/signin");
      }
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
          {t("Nova Senha")}
        </Heading>
        <Text
          mb="36px"
          ms="4px"
          color="gray.600"
          fontWeight="400"
          fontSize="md"
        >
          {t("Digite sua nova senha")}
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
        <form onSubmit={handleSubmit(handleResetPassword)}>
          <FormInput
            variant="auth"
            fontSize="sm"
            type="password"
            placeholder="********"
            margin="0 0 24px 0"
            fontWeight="500"
            size="lg"
            borderRadius="6px"
            bgColor={"primary.50"}
            {...register("password")}
            error={errors.password?.message}
            label="Nova Senha *"
          />
          <FormInput
            variant="auth"
            fontSize="sm"
            type="password"
            placeholder="********"
            margin="0 0 24px 0"
            fontWeight="500"
            size="lg"
            borderRadius="6px"
            bgColor={"primary.50"}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            label="Confirmar Senha *"
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
            _active={{ bgColor: "primary.200" }}
            type="submit"
            isLoading={isLoading}
            label={t("Alterar Senha")}
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