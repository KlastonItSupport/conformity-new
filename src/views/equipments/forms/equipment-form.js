import { VStack } from "@chakra-ui/react";
import { FormTextArea } from "components/components";
import { FormInput } from "components/components";
import React from "react";
import { useForm } from "react-hook-form";

const EquipmentForm = ({ formValues, formRef }) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      <FormInput
        label={"Nome * "}
        {...register("name")}
        error={errors.name?.message}
        defaultValue={formValues?.name}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="file"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Insira seus documentos"}
        {...register("documents")}
        multiple
        className="center-file-input"
        error={errors.documents?.message}
      />
      <FormTextArea
        label={"Descrição * "}
        {...register("description")}
        error={errors.description?.message}
        defaultValue={formValues?.description}
        height={"125px"}
      />
      <FormInput
        label={"Modelo * "}
        {...register("model")}
        error={errors.model?.message}
        defaultValue={formValues?.model}
      />
      <FormInput
        label={"Número de série * "}
        {...register("series")}
        error={errors.series?.message}
        defaultValue={formValues?.series}
      />
      <FormInput
        label={"Fabricante * "}
        {...register("manufacturer")}
        error={errors.manufacturer?.message}
        defaultValue={formValues?.manufacturer}
      />
      <FormInput
        label={"Certificado * "}
        {...register("certified")}
        error={errors.certified?.message}
        defaultValue={formValues?.certified}
      />
      <FormInput
        label={"Range * "}
        {...register("range")}
        error={errors.range?.message}
        defaultValue={formValues?.range}
      />
      <FormInput
        label={"Tolerância * "}
        {...register("tolerancy")}
        error={errors.tolerancy?.message}
        defaultValue={formValues?.tolerancy}
      />
    </VStack>
  );
};

export default EquipmentForm;
