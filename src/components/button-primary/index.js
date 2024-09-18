import { Button } from "@chakra-ui/react";

export const ButtonPrimary = ({
  hasShadow = true,
  label,
  color,
  isLoading = false,
  ...rest
}) => {
  return (
    <Button
      fontSize="sm"
      fontWeight="bold"
      h="50"
      boxShadow={hasShadow ? "0 4px 16px rgba(0, 0, 0, 0.2)" : "none"}
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
