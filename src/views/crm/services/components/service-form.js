import { VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";

const serviceSchema = Yup.object().shape({
  documents: Yup.array().of(Yup.string().required("Required")),
  title: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  clientType: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  value: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const ServicesForm = ({
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
    setValue,
  } = useForm({ resolver: yupResolver(serviceSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      sleep(1000);
      setLoading(false);
      onClose();
      return;
    }

    await onEdit();
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    if (formValues) {
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Ex: ISO 9001"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Serviço: "
        width="100%"
        {...register("title")}
        error={errors.title?.message}
        defaultValue={formValues?.title}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Ex: R$100"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Valor:"
        width="100%"
        {...register("value")}
        error={errors.value?.message}
        defaultValue={formValues?.value}
      />
    </VStack>
  );
};

export default ServicesForm;
