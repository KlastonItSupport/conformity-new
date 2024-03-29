import { Select, Text } from "@chakra-ui/react";
import React, { forwardRef } from "react";

const SelectInput = forwardRef(
  ({ label, errors, register, options, ...rest }, ref) => {
    return (
      <>
        {label && (
          <Text fontSize="sm" fontWeight="500" pb="10px" pl={"5px"}>
            {label}
          </Text>
        )}
        <Select
          ref={ref}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          fontWeight="500"
          size="lg"
          mb={errors ? "0" : "24px"}
          borderRadius="6px"
          bgColor={"primary.50"}
          {...rest}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {errors && (
          <Text fontSize="sm" fontWeight="500" color={"red.600"}>
            {errors.message}
          </Text>
        )}
      </>
    );
  }
);

export default SelectInput;
