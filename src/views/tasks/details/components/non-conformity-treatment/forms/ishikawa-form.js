import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";
import * as Yup from "yup";
import { FormInput } from "components/components";

export const schema = Yup.object().shape({
  method: Yup.string().required("Obrigatório"),
  workHand: Yup.string().required("Obrigatório"),
  measure: Yup.string().required("Obrigatório"),
  environment: Yup.string().required("Obrigatório"),
  machine: Yup.string().required("Obrigatório"),
  material: Yup.string().required("Obrigatório"),
});

const IshikawaForm = ({
  formRef,
  onClose,
  setIsLoading,
  formValues,
  event = "add",
  onAdd,
  onEdit,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    if (event === "edit") {
      await onEdit(data);
      setIsLoading(false);
      onClose();
      return;
    }

    await onAdd(data);
    setIsLoading(false);
    onClose();
  };
  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormInput
        label={"Método"}
        {...register("method")}
        error={errors.method?.message}
        defaultValue={formValues?.method}
      />{" "}
      <FormInput
        label={"Máquina"}
        {...register("machine")}
        error={errors.machine?.message}
        defaultValue={formValues?.machine}
      />
      <FormInput
        label={"Material"}
        {...register("material")}
        error={errors.material?.message}
        defaultValue={formValues?.material}
      />
      <FormInput
        label={"Mão de obra"}
        {...register("workHand")}
        error={errors.workHand?.message}
        defaultValue={formValues?.workHand}
      />{" "}
      <FormInput
        label={"Medida"}
        {...register("measure")}
        error={errors.measure?.message}
        defaultValue={formValues?.measure}
      />
      <FormInput
        label={"Meio ambiente"}
        {...register("environment")}
        error={errors.environment?.message}
        defaultValue={formValues?.environment}
      />
    </form>
  );
};

export default IshikawaForm;
