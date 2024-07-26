import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "components/components";
import * as Yup from "yup";
import { TasksContext } from "providers/tasks";

const schema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});

const OriginForm = ({
  formRef,
  onClose,
  event = "add",
  id,
  formValues,
  setLoading,
}) => {
  const { createOrigins, editOrigins } = useContext(TasksContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (event === "add") {
      setLoading(true);
      const response = await createOrigins(data);
      setLoading(false);
      onClose(response);
      return;
    }
    setLoading(true);

    const response = await editOrigins({ ...data, id });
    onClose(response);

    setLoading(false);
  };

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormInput
        label={"Nome * "}
        {...register("name")}
        defaultValue={formValues?.name}
        error={errors.name?.message}
      />
    </form>
  );
};

export default OriginForm;
