import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "components/components";
import * as Yup from "yup";
import { api } from "api/api";
import { AuthContext } from "providers/auth";
import { toast } from "react-toastify";

export const originSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});

const TaskClassification = ({
  formRef,
  onClose,
  setLoading,
  event = "add",
  formValues,
  id,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(originSchema),
  });
  const { getToken } = useContext(AuthContext);

  const createClassification = async (data) => {
    const res = await api.post("/classifications", data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    toast.success("Classificação criada com sucesso");
    return res.data;
  };

  const editClassification = async (data) => {
    const res = await api.patch(`/classifications/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    toast.success("Classificação editada com sucesso");
    return res.data;
  };

  const onSubmit = async (data) => {
    if (event === "edit") {
      setLoading(true);

      const res = await editClassification(data);

      setLoading(false);
      onClose(res);
      return res.data;
    }
    setLoading(true);

    const classification = await createClassification(data);

    setLoading(false);
    onClose(classification);
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
        error={errors.name?.message}
        defaultValue={formValues?.name}
      />
    </form>
  );
};

export default TaskClassification;
