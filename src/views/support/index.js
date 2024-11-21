import React from "react";
import { NavBar } from "components/navbar";
import { HStack, VStack } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import SupportForm from "./components/support-form";

const SupportPage = () => {
  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },

    {
      path: "/support",
      label: "Suporte",
      isCurrent: true,
    },
  ];

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <HStack justify={"start"} w={"95vw"} py={"10px"}>
          <SupportForm />
        </HStack>
      </VStack>
    </>
  );
};

export default SupportPage;
