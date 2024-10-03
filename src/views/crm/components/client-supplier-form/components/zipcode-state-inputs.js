import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import { cityAccordingToState } from "helpers/addresses";
import { useAddress } from "hooks/address";
import React from "react";

const ZipCodeStates = ({
  register,
  errors,
  formValues,
  setValue,
  statesOptions,
  setCityOptions,
}) => {
  const { zipCodeDetails } = useAddress();
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <FormInput
          label={"CEP * "}
          {...register("cep")}
          error={errors.cep?.message}
          defaultValue={formValues?.cep}
          placelholder="Ex: 04711-130"
          mask="99999-999"
          onChange={async (e) => {
            const cep = e.target.value;

            if (cep.length === 9) {
              const addressDetails = await zipCodeDetails(cep);

              const citiesOptions = cityAccordingToState.estados
                .find((state) => state.sigla === addressDetails.stateInitials)
                .cidades.map((city) => {
                  return {
                    label: city,
                    value: city,
                  };
                });

              setCityOptions(citiesOptions);
              setValue("neighborhood", addressDetails.neighborhood);
              setValue("city", addressDetails.city);
              setValue("state", addressDetails.stateInitials);
            }
          }}
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <SelectInput
          label={"Estado * "}
          {...register("state")}
          error={errors.state?.message}
          defaultValue={formValues?.state}
          options={statesOptions}
          onChange={(e) => {
            const stateSelected = e.target.value;
            const citiesOptions = cityAccordingToState.estados
              .find((state) => state.sigla === stateSelected)
              .cidades.map((city) => {
                return {
                  label: city,
                  value: city,
                };
              });
            setCityOptions(citiesOptions);
          }}
        />
      </VStack>
    </HStack>
  );
};

export default ZipCodeStates;
