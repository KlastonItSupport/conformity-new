import { VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";

const serviceSchema = Yup.object().shape({
  service: Yup.string().required("Campo obrigatório"),
  value: Yup.string().required("Campo obrigatório"),
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
      const service = await onAdd(data);
      onClose(service);
      setLoading(false);
      return;
    }

    const service = await onEdit({ ...data, id });
    setLoading(false);
    onClose(service);
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
        {...register("service")}
        error={errors.service?.message}
        defaultValue={formValues?.service}
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
