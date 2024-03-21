import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

export const SignInForm = () => {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.600";

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
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
        <FormControl>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            Email *
          </FormLabel>
          <Input
            isRequired={true}
            variant="auth"
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="email"
            placeholder="emailexample@hotmail.com"
            mb="24px"
            fontWeight="500"
            size="lg"
            borderRadius="6px"
            bgColor={"primary.50"}
          />
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Senha *
          </FormLabel>
          <InputGroup size="md">
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="Min. 8 caracteres"
              mb="24px"
              size="lg"
              type={show ? "text" : "password"}
              variant="auth"
              borderRadius="6px"
              bgColor={"primary.50"}
            />
            <InputRightElement display="flex" alignItems="center" mt="4px">
              <Icon
                color={textColorSecondary}
                _hover={{ cursor: "pointer" }}
                as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
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
            isRequired={true}
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
          <Button
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
          >
            Entrar
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
};
