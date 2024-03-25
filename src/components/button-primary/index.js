import { Button } from "@chakra-ui/react";

export const ButtonPrimary = ({ label, color, ...rest }) => {
  return (
    <Button
      fontSize="sm"
      fontWeight="bold"
      w="100%"
      h="50"
      bgColor={"primary.100"}
      _hover={{ bgColor: "primary.200" }}
      textColor={"white"}
      boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
      borderRadius="7px"
      _active={{ bgColor: color ?? "primary.200" }}
      {...rest}
    >
      {label}
    </Button>
  );
};
