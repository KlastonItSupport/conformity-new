import { HStack, Link } from "@chakra-ui/react";
import React from "react";

const NavigationLinks = ({ routeTree, padding }) => {
  return (
    <HStack
      w={"100%"}
      pb={"10px"}
      // paddingX={isMobile ? "px" : 0}
      padding={padding}
    >
      {routeTree.map((route, index) => {
        const isNotLast = index !== 0;
        return (
          <Link
            color={route?.isCurrent ? "secondaryGray.600" : "primary.100"}
            _hover={{ cursor: route?.isCurrent ? "default" : "pointer" }}
            href={route?.isCurrent ? null : route.path}
            key={index + route.path}
          >
            <span>{isNotLast && "/ "}</span>
            {route.label}
          </Link>
        );
      })}
    </HStack>
  );
};

export default NavigationLinks;
