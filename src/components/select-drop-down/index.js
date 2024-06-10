import React, { forwardRef } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Controller } from "react-hook-form";

export const SelectDropDown = forwardRef(
  ({ options, label, error, ...rest }, ref) => {
    return (
      <FormControl isInvalid={!!error}>
        <FormLabel ms="4px" fontSize="sm" fontWeight="500" display="flex">
          {label}
        </FormLabel>
        <Controller
          name={rest.name}
          control={rest.control}
          render={({ field }) => (
            <Select
              {...field}
              ref={ref}
              isMulti
              options={options}
              closeMenuOnSelect={false}
              {...rest}
            />
          )}
        />
        {error && (
          <FormErrorMessage>
            <Text fontSize="sm" fontWeight="500" color={"red.600"}>
              {error.message}
            </Text>
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
