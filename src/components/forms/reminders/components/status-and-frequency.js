import { HStack, VStack } from "@chakra-ui/react";
import SelectInput from "components/select";
import React from "react";

const StatusAndFrequency = ({ register, errors, setFrequency }) => {
  return (
    <HStack w={"100%"}>
      <VStack w={"100%"} alignItems={"start"}>
        <SelectInput
          label="Status"
          {...register("status")}
          errors={errors.status}
          options={[
            {
              label: "Ativo",
              value: "ATIVO",
            },
            {
              label: "Inativo",
              value: "INATIVO",
            },
          ]}
        />
      </VStack>
      <VStack w={"100%"} alignItems={"start"}>
        <SelectInput
          label="Frequência"
          {...register("frequency")}
          errors={errors.frequency}
          defaultValue={{ label: "Diária", value: "DIÁRIA" }}
          onChange={(e) => setFrequency(e.target.value)}
          options={[
            {
              label: "Diária",
              value: "DIÁRIA",
            },
            {
              label: "Semanal",
              value: "SEMANAL",
            },
            {
              label: "Mensal",
              value: "MENSAL",
            },
            {
              label: "Anual",
              value: "ANUAL",
            },
            {
              label: "Uma vez",
              value: "UMA VEZ",
            },
          ]}
        />
      </VStack>
    </HStack>
  );
};

export default StatusAndFrequency;
