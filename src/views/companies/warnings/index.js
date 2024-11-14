import React, { useRef } from "react";
import { NavBar } from "components/navbar";
import { HStack, VStack } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import WarningsForm from "./components/form";
import withWarningCheck from "hoc/with-warning-check";

const WarningsPage = () => {
  const formRef = useRef();

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },

    {
      path: "/companies/warnings",
      label: "Avisos",
      isCurrent: true,
    },
  ];

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <HStack justify={"start"} w={"95vw"} py={"20px"}>
          <WarningsForm formRef={formRef} />
        </HStack>
      </VStack>
    </>
  );
};

export default withWarningCheck(WarningsPage);
