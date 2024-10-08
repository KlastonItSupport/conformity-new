import {
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";
import InputMask from "react-input-mask";

const FormInput = forwardRef(
  (
    {
      label,
      error,
      margin,
      onClickIcon,
      width,
      icon,
      innerPadding,
      mask,
      ...rest
    },
    ref
  ) => {
    return (
      <InputGroup
        size="md"
        display={"flex"}
        flexDirection={"column"}
        margin={margin}
        width={width}
      >
        {label && (
          <FormLabel
            padding={innerPadding}
            fontSize="sm"
            fontWeight="500"
            display="flex"
          >
            {label}
          </FormLabel>
        )}

        {mask ? (
          <InputMask mask={mask} {...rest} maskChar={null}>
            {(inputProps) => (
              <Input
                {...inputProps}
                fontSize="sm"
                size="lg"
                variant="auth"
                borderRadius="6px"
                bgColor={"primary.50"}
                ref={ref}
              />
            )}
          </InputMask>
        ) : (
          <Input
            fontSize="sm"
            size="lg"
            variant="auth"
            borderRadius="6px"
            bgColor={"primary.50"}
            {...rest}
            ref={ref}
          />
        )}

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
