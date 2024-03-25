import {
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";

const FormInput = forwardRef(
  ({ label, placeholder, error, margin, onClickIcon, icon, ...rest }, ref) => {
    return (
      <InputGroup
        size="md"
        display={"flex"}
        flexDirection={"column"}
        margin={margin}
      >
        <FormLabel ms="4px" fontSize="sm" fontWeight="500" display="flex">
          {label}
        </FormLabel>
        <Input
          fontSize="sm"
          placeholder="Min. 8 caracteres"
          size="lg"
          variant="auth"
          borderRadius="6px"
          bgColor={"primary.50"}
          {...rest}
          ref={ref}
        />
        {icon && (
          <InputRightElement display="flex" alignItems="center" mt="4px">
            <Icon
              mt={"60px"}
              _hover={{ cursor: "pointer" }}
              as={icon}
              onClick={onClickIcon}
            />
          </InputRightElement>
        )}
        <FormLabel
          fontSize="sm"
          fontWeight="500"
          display="flex"
          color={"red.600"}
        >
          {error}
        </FormLabel>
      </InputGroup>
    );
  }
);

export default FormInput;
