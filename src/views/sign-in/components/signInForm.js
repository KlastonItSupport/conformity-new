import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Flex,
  FormLabel,
  Heading,
  Select,
  Text,
  VStack,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import { AuthContext } from "providers/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "schemas/auth/sign-in.schema";
import FormInput from "components/form-input/form-input";
import { RiEyeCloseLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { ButtonPrimary } from "components/button-primary";
import { useTranslation } from "react-i18next";

export const SignInForm = () => {
  const { signIn } = useContext(AuthContext);
  const { t } = useTranslation();

  const history = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.500";

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [isSignInLoading, setIsSignInLoading] = React.useState(false);

  const handleSignIn = async (data) => {
    setIsSignInLoading(true);
    await signIn(data, history);
    setIsSignInLoading(false);
  };

  return (
    <Flex
      flexDirection="column"
      w="100%"
      h="100%"
      justifyContent="center"
      p={{ base: "2rem", lg: "3rem" }}
      position="relative"
      bg="#fafafa"
    >
      <VStack 
        alignItems="start" 
        w="100%" 
        spacing={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
      >
        <Box>
          <Heading
            fontSize={{ base: "21px", md: "21px", lg: "21px" }}
            color={textColor}
            lineHeight="shorter"
            mb={2}
          >
            {t("Seja bem-vindo ao Conformity!")}
          </Heading>
          
          <Text
            color={textColorSecondary}
            fontWeight="bold"
            fontSize={{ base: "sm", md: "lg" }}
            letterSpacing="0.2px"
            maxW="100%"
          >
            {t("A solução mais completa e segura em gestão administrativa.")}
          </Text>
        </Box>

        <Flex
          direction="column"
          w="100%"
          maxW={{ base: "100%", md: "420px" }}
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          gap="1.5rem"
        >
          <HSeparator />
          
          <form onSubmit={handleSubmit((data) => handleSignIn(data))}>
            <VStack spacing="1.5rem" align="stretch">
              <FormInput
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="emailexample@hotmail.com"
                fontWeight="500"
                size="lg"
                borderRadius="6px"
                bgColor="primary.50"
                {...register("email")}
                error={errors.email?.message}
                label="Email *"
              />

              <FormInput
                fontSize="sm"
                placeholder={t("Min. 8 caracteres")}
                size="lg"
                type={show ? "text" : "password"}
                variant="auth"
                borderRadius="6px"
                icon={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                bgColor="primary.50"
                {...register("password")}
                error={errors.password?.message}
                label={t("Senha *")}
                onClickIcon={handleClick}
              />

              <Box>
                <FormLabel
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                >
                  {t("Idioma")}
                </FormLabel>
                <Select
                  variant="auth"
                  fontSize="sm"
                  placeholder={t("Selecione o idioma")}
                  fontWeight="500"
                  size="lg"
                  borderRadius="6px"
                  bgColor="primary.50"
                  {...register("language")}
                  error={errors.language?.message}
                >
                  <option value="pt">{t("Português")}</option>
                  <option value="en-US">{t("Inglês")}</option>
                  <option value="es">{t("Espanhol")}</option>
                </Select>
              </Box>

              <NavLink to="/forgot-password">
                <Text
                  color="primary.100"
                  fontSize="md"
                  fontWeight="500"
                >
                  {t("Esqueceu a senha?")}
                </Text>
              </NavLink>

              <ButtonPrimary
                fontSize="sm"
                fontWeight="bold"
                w="100%"
                h="50"
                bgColor="primary.100"
                _hover={{ bgColor: "primary.200" }}
                textColor="white"
                boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
                borderRadius="7px"
                _active={{ bgColor: "primary.200" }}
                type="submit"
                label={t("Entrar")}
                isLoading={isSignInLoading}
              />
            </VStack>
          </form>
        </Flex>
      </VStack>
    </Flex>
  );
};
