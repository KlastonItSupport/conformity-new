import { VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormTextArea } from "components/components";
import { FormInput } from "components/components";
import React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { handlingMultipleFilesToBase64 } from "helpers/buffer-to-base-64";

const equipmentSchema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  description: Yup.string(),
  model: Yup.string().required("O modelo é obrigatório"),
  series: Yup.string().required("A série é obrigatório"),
  manufacturer: Yup.string().required("O fabricante é obrigatório"),
  certified: Yup.string().required("O certificado é obrigatório"),
  range: Yup.string().required("O range é obrigatório"),
  tolerancy: Yup.string().required("A tolerância é obrigatória"),
  documents: Yup.mixed(),
});

const EquipmentForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({ resolver: yupResolver(equipmentSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      await onAdd({ ...data });
      setLoading(false);
      onClose();
      return;
    }

    await onEdit(data, id);
    setLoading(false);
    onClose();
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
