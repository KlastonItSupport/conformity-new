import { HStack, Link, useBreakpointValue } from "@chakra-ui/react";
import React from "react";

const NavigationLinks = ({ routeTree }) => {
  const isMobile = useBreakpointValue({
    base: false,
    md: false,
    lg: false,
    sm: true,
  });
  return (
    <HStack
      w={isMobile ? "100vw" : "95vw"}
      pb={"20px"}
      paddingX={isMobile ? "20px" : 0}
    >
      {routeTree.map((route, index) => {
        const isNotLast = index !== 0;
        return (
          <Link
            color={route?.isCurrent ? "secondaryGray.600" : "primary.100"}
            href={route.path}
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
