import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "components/components";
import * as Yup from "yup";
import { AuthContext } from "providers/auth";
import { api } from "api/api";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

export const originSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});

const TaskType = ({
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
  const createTaskType = async (data) => {
    const response = await api.post("types", data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.TASKS_TYPES_CREATED,
      },
    });
    toast.success("Tipo de tarefa criada com sucesso!");
    return response.data;
  };
  const updateTaskType = async (data) => {
    const response = await api.patch(`types/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.TASKS_TYPES_UPDATED,
      },
    });
    toast.success("Tipo de tarefa atualizada com sucesso!");
    return response.data;
  };

  const onSubmit = async (data) => {
    if (event === "edit") {
      const response = await updateTaskType(data);
      onClose(response);
      return;
    }
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
        defaultValue={formValues?.name}
      />
    </form>
  );
};

export default TaskType;
