import { HStack, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { ButtonPrimary } from "components/button-primary";
import TextEditor from "components/text-editor-mce";
import { WarningsContext } from "providers/warnings";

const warningSchema = Yup.object().shape({
  showWarning: Yup.string(),
});

const WarningsForm = ({ formRef }) => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const richTextRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(warningSchema) });

  const { createWarning } = useContext(WarningsContext);
  const onSubmit = async (data) => {
    setIsLoading(true);

    const warning = await createWarning({
      ...data,
      warningMessage: description,
    });
    if (warning) {
      setDescription("");
    }
    setIsLoading(false);
  };

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
      backgroundColor={"white"}
      border={"1px solid #E0E0E0"}
      padding={"20px"}
      borderRadius={"6px"}
    >
      <SelectInput
        label="Exibir aviso?"
        {...register("showWarning")}
        errors={errors.showWarning}
        defaultValue={{ label: "Sim", value: 1 }}
        options={[
          {
            label: "Sim",
            value: 1,
          },
          {
            label: "Não",
            value: 0,
          },
        ]}
      />
      <Text fontSize="sm" fontWeight="500" paddingLeft={"5px"}>
        Mensagem
      </Text>
      <TextEditor
        value={description}
        onChange={setDescription}
        ref={richTextRef}
      />
      <HStack w={"100%"} justifyContent={"center"}>
        <ButtonPrimary
          fontSize="sm"
          fontWeight="bold"
          h="50"
          bgColor={"primary.100"}
          _hover={{ bgColor: "primary.200" }}
          textColor={"white"}
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
          borderRadius="7px"
          _active={{ bgColor: "primary.200" }}
          label={"Disparar Aviso"}
          type="submit"
          width="150px"
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  );
};

export default WarningsForm;
