import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "components/components";
import * as Yup from "yup";
import { api } from "api/api";
import { AuthContext } from "providers/auth";
import { toast } from "react-toastify";
import { sleep } from "helpers/sleep";

export const originSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});

const OriginForm = ({ formRef, onClose, setLoading }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(originSchema),
  });
  const { getToken } = useContext(AuthContext);

  const createOrigin = async (data) => {
    const response = await api.post("origins", data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    toast.success("Origem criada com sucesso!");
    return response.data;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await createOrigin(data);
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

export default OriginForm;
