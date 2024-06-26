import { Button } from "@chakra-ui/react";

export const ButtonPrimary = ({ label, color, isLoading = false, ...rest }) => {
  return (
    <Button
      fontSize="sm"
      fontWeight="bold"
      h="50"
      boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
      borderRadius="7px"
      _active={{ bgColor: color ?? "primary.200" }}
      isLoading={isLoading}
      disabled={isLoading}
      {...rest}
    >
      {label}
    </Button>
  );
};
