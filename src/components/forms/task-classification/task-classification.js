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

const TaskClassification = ({ formRef, onClose, setLoading }) => {
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

  const onSubmit = async (data) => {
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
      />
    </form>
  );
};

export default TaskClassification;
