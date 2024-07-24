import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "components/components";
import * as Yup from "yup";
import { AuthContext } from "providers/auth";
import { api } from "api/api";
import { toast } from "react-toastify";
import { SelectDropDown } from "components/select-drop-down";
import { useTranslation } from "react-i18next";

export const evaluatorSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});

const TaskEvaluator = ({ formRef, onClose, setLoading }) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(evaluatorSchema),
  });
  const user = [
    {
      label: "João da Silva",
      value: "1",
    },
    {
      label: "Bruno Santos",
      value: "2",
    },
    {
      label: "Maria da Silva",
      value: "3",
    },
  ];
  const options = user.map((user) => ({
    value: user.value,
    label: user.label,
  }));

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
      <SelectDropDown
        options={options}
        label={t("Selecione os usuários")}
        error={errors.users}
        control={control}
        name={"users"}
        placeholder={t("Clique ou digite para adicionar o usuário")}
      />
    </form>
  );
};

export default TaskEvaluator;
