import React from "react";
import {
  Box,
  HStack,
  VStack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { SignInForm } from "./components/signInForm";
import { RightSideMessage } from "./components/rightSideMessage";

function SignInPage() {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  return (
    <Box w={"100vw"} h={"100vh"} bg={"primary.50"}>
      {isDesktop ? (
        <HStack w={"90%"} margin={"0 auto"} px={"30px"} alignItems={"start"}>
          <SignInForm />
          <RightSideMessage />
        </HStack>
      ) : (
        <VStack w={"100%"}>
          <RightSideMessage />
          <SignInForm />
        </VStack>
      )}
    </Box>
  );
}

export default SignInPage;
