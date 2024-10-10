import { Select, Text } from "@chakra-ui/react";
import React, { forwardRef } from "react";

const SelectInput = forwardRef(
  (
    { paddingLabel, label, errors, register, options, defaultValue, ...rest },
    ref
  ) => {
    return (
      <>
        {label && (
          <Text
            fontSize="sm"
            fontWeight="500"
            pb={paddingLabel ? paddingLabel : "10px"}
            pl={"5px"}
          >
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
          cursor={"pointer"}
          {...rest}
        >
          {defaultValue && (
            <option key={defaultValue.value} value={defaultValue.value}>
              {defaultValue.label}
            </option>
          )}
          {options.map((option, index) => {
            const optionJsx = (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            );
            if (!defaultValue) {
              return optionJsx;
            }
            if (defaultValue.value !== option.value) {
              return optionJsx;
            }

            return false;
          })}
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
