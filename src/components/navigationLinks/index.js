import { HStack, Link } from "@chakra-ui/react";
import { useBreakpoint } from "hooks/usebreakpoint";
import React from "react";

const NavigationLinks = ({ routeTree, padding }) => {
  const { isMobile } = useBreakpoint();

  return (
    <HStack
      w={isMobile ? "100vw" : "95vw"}
      pb={"20px"}
      paddingX={isMobile ? "20px" : 0}
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
