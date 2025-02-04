import { HStack, Link } from "@chakra-ui/react";
import React from "react";

const NavigationLinks = ({ routeTree, padding, width }) => {
  return (
    <HStack
      w={"220px"}
      pt={"5px"}
      pb={"10px"}
      pl={"50px"}
      padding={padding}
      bg={"#fafafa"}
      borderTopRadius="lg"
      px={4}
      alignSelf="flex-start"
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
