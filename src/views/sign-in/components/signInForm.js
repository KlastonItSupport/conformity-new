import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Button,
  Flex,
  FormLabel,
  Heading,
  Select,
  Text,
  VStack,
  useColorModeValue,
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

export const SignInForm = () => {
  const { signIn } = useContext(AuthContext);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.600";

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [isSignInLoading, setIsSignInLoading] = React.useState(false);

  const handleSignIn = async (data) => {
    setIsSignInLoading(true);
    await signIn(data);
    setIsSignInLoading(false);
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
          Logar
        </Heading>
        <Text
          mb="36px"
          ms="4px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
        >
          Insira seu email e senha para entrar na nossa plataforma
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
        <form onSubmit={handleSubmit((data) => handleSignIn(data))}>
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
            {...register("email")}
            error={errors.email?.message}
            label="Email *"
          />

          <FormInput
            fontSize="sm"
            placeholder="Min. 8 caracteres"
            margin="0 0 10px 0 "
            size="lg"
            type={show ? "text" : "password"}
            variant="auth"
            borderRadius="6px"
            icon={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
            bgColor={"primary.50"}
            {...register("password")}
            error={errors.password?.message}
            label="Senha *"
            onClickIcon={handleClick}
          />

          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Idioma
          </FormLabel>
          <Select
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="email"
            placeholder="Selecione o idioma"
            mb="24px"
            fontWeight="500"
            size="lg"
            borderRadius="6px"
            bgColor={"primary.50"}
            // {...register("language")}
            // error={errors.language?.message}
          >
            <option value="option1">Portugues</option>
            <option value="option1">Inglês</option>
            <option value="option1">Espanhol</option>
          </Select>
          <Flex mb="24px">
            <NavLink to="/auth/forgot-password">
              <Text
                color={"primary.100"}
                fontSize="sm"
                w="124px"
                fontWeight="500"
              >
                Esqueceu a senha?
              </Text>
            </NavLink>
          </Flex>
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
            label="Entrar"
            isLoading={isSignInLoading}
          />
        </form>
      </Flex>
    </Flex>
  );
};
