import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { SelectDropDown } from "components/select-drop-down";
import { useTranslation } from "react-i18next";
import { CompanyContext } from "providers/company";

export const evaluatorSchema = Yup.object().shape({
  users: Yup.array().required("Usuários obrigatórios"),
});

const TaskEvaluator = ({ formRef, onClose, setLoading }) => {
  const { t } = useTranslation();
  const { getCompanyUsers } = useContext(CompanyContext);
  const [users, setUsers] = useState([]);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(evaluatorSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await onClose(data.users.map((user) => user.value));
    setLoading(false);
  };

  useEffect(() => {
    getCompanyUsers(false).then((users) =>
      setUsers(
        users.map((user) => {
          const option = { label: user.name, value: user.id };
          return option;
        })
      )
    );
  }, []);

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      {users.length > 0 && (
        <SelectDropDown
          options={users}
          label={t("Selecione os usuários")}
          error={errors.users}
          control={control}
          name={"users"}
          placeholder={t("Clique ou digite para adicionar o usuário")}
        />
      )}
    </form>
  );
};

export default TaskEvaluator;
