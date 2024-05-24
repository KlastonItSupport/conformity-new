import {
  FormLabel,
  Icon,
  Textarea,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";

const FormTextArea = forwardRef(
  ({ label, error, margin, onClickIcon, width, icon, ...rest }, ref) => {
    return (
      <>
        {label && (
          <FormLabel fontSize="sm" fontWeight="500" display="flex">
            {label}
          </FormLabel>
        )}
        <InputGroup
          size="md"
          display={"flex"}
          flexDirection={"column"}
          margin={margin}
          width={width}
          border={"1px solid #ddd"}
        >
          <Textarea
            fontSize="sm"
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
        </InputGroup>
        <FormLabel
          fontSize="sm"
          fontWeight="500"
          display="flex"
          color={"red.600"}
        >
          {error}
        </FormLabel>
      </>
    );
  }
);

export default FormTextArea;
