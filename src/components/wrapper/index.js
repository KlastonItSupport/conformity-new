import { VStack } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import React from "react";

const Wrapper = ({ children, routeTreePaths }) => {
  return (
    <VStack
      marginTop={"100px"}
      spacing={0}
      w="100%"
      h="100%"
      paddingX={"20px"}
      mt={"80px !important"}
    >
      {routeTreePaths && <NavigationLinks routeTree={routeTreePaths} />}
      {children}
    </VStack>
  );
};

export default Wrapper;
