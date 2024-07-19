import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "components/components";
import * as Yup from "yup";
import { AuthContext } from "providers/auth";
import { api } from "api/api";
import { toast } from "react-toastify";

export const originSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});

const TaskType = ({ formRef, onClose, setLoading }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(originSchema),
  });

  const { getToken } = useContext(AuthContext);
  const createTaskType = async (data) => {
    const response = await api.post("types", data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    toast.success("Tipo de tarefa criada com sucesso!");
    return response.data;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await createTaskType(data);
    setLoading(false);
    onClose(response);
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
      />
    </form>
  );
};

export default TaskType;
