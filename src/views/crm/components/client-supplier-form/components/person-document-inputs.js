import { HStack, VStack } from "@chakra-ui/react";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import { useCNPJInfos } from "hooks/cnpj-infos";
import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

const PersonDocument = ({
  register,
  errors,
  formValues,
  setValue,
  control,
}) => {
  const cnpjMask = "99.999.999/9999-99";
  const cpfMask = "999.999.999-99";

  const [selectedMask, setSelectedMask] = useState(cnpjMask);
  const cepWatchedValue = useWatch({
    control,
    name: "clientType",
  });

  useEffect(() => {
    if (cepWatchedValue === "fisica") {
      setSelectedMask(cpfMask);
      return;
    }
    setSelectedMask(cnpjMask);
  }, [cepWatchedValue]);

  const { getCNPJInfos } = useCNPJInfos();
  return (
    <HStack w={"100%"}>
      <VStack align={"start"} w={"100%"}>
        <SelectInput
          label={"Pessoa * "}
          {...register("personType")}
          error={errors.personType?.message}
          options={[
            {
              label: "Jurídica",
              value: "juridica",
            },
            {
              label: "Física",
              value: "fisica",
            },
          ]}
          defaultValue={{
            label: formValues?.personType,
            value: formValues?.personType,
          }}
        />
      </VStack>
      <VStack align={"start"} w={"100%"} mt={"5px"}>
        <FormInput
          label={"CNPJ/CPF * "}
          {...register("document")}
          error={errors.document?.message}
          defaultValue={formValues?.cnpjCpf}
          placeholder={`Ex: ${selectedMask}`}
          mask={selectedMask}
          onChange={async (e) => {
            const document = e.target.value;
            if (document.length === 18 && selectedMask === cnpjMask) {
              const cnpjInfos = await getCNPJInfos(document);
              setValue("socialReason", cnpjInfos.socialReason);
              setValue("cep", cnpjInfos.cep);
              setValue("number", cnpjInfos.number);
              setValue("celphone", cnpjInfos.celphone);
              setValue("email", cnpjInfos.email);
            }
          }}
        />
      </VStack>
    </HStack>
  );
};

export default PersonDocument;
