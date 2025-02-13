import React from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { SignInForm } from "./components/signInForm";
import { RightSideMessage } from "./components/rightSideMessage";

function SignInPage() {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  return (
    <Box
      w="100vw"
      minH="100vh"
      backgroundImage="linear-gradient(to bottom, #6E9DC0, #2A7EC2)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Flex
        w="100%"
        maxW="1200px"
        bg="#fafafa"
        borderRadius="2xl"
        boxShadow="xl"
        direction={{ base: "column", lg: "row" }}
        overflow="hidden"
        minH={{ base: "auto", lg: "600px" }}
        position="relative"
        py={3}
        my={{ base: 4, lg: 12 }}
      >
        <SignInForm 
          flex={1} 
          w="100%"
          maxW={{ base: "100%", lg: "50%" }}
          order={{ base: 2, lg: 1 }}
          position="relative"
          zIndex={2}
          bg="#fafafa"
        />
        <Box 
          position={{ base: "relative", lg: "absolute" }}
          right={0}
          top={0}
          w={{ base: "100%", lg: "50%" }}
          h={{ base: "300px", lg: "100%" }}
          order={{ base: 1, lg: 2 }}
          zIndex={1}
          my={3}
        >
          <RightSideMessage />
        </Box>
      </Flex>
    </Box>
  );
}

export default SignInPage;
