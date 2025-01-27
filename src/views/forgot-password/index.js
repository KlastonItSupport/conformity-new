import React from "react";
import { Box, HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import { ForgotPasswordForm } from "./components/forgotPassword";

function ForgotPasswordPage() {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  return (
    <Box w={"100vw"} h={"100vh"} bg={"primary.50"}>
      {isDesktop ? (
        <HStack w={"90%"} margin={"0 auto"} px={"30px"} alignItems={"start"}>
          <ForgotPasswordForm />
        </HStack>
      ) : (
        <VStack w={"100%"}>
          <ForgotPasswordForm />
        </VStack>
      )}
    </Box>
  );
}

export default ForgotPasswordPage;