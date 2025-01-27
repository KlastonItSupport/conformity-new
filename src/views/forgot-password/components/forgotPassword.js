import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
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
  const { resetPassword } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.600";
  const [isLoading, setIsLoading] = React.useState(false);

  const handleResetPassword = async (data) => {
    setIsLoading(true);
    await resetPassword(data.email);
    navigate("/auth/signin");
    setIsLoading(false);
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
          color={textColor}
        >
          {t("Recuperar Senha")}
        </Heading>
        <Text
          mb="36px"
          ms="4px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
        >
          {t("Insira seu email para receber instruções de recuperação")}
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
        <Flex align="center" mb="25px">
          <HSeparator />
        </Flex>
        <form onSubmit={handleSubmit(handleResetPassword)}>
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
            label={t("Enviar")}
            isLoading={isLoading}
          />
        </form>
      </Flex>
    </Flex>
  );
};