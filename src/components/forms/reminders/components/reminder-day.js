import SelectInput from "components/select";
import React from "react";

const ReminderDay = ({ register, errors }) => {
  return (
    <SelectInput
      label="Dia do Lembrete"
      {...register("weekDay")}
      errors={errors.weekDay}
      options={[
        {
          label: "Segunda",
          value: "SEGUNDA",
        },
        {
          label: "Terça",
          value: "TERÇA",
        },
        {
          label: "Quarta",
          value: "QUARTA",
        },
        {
          label: "Quinta",
          value: "QUINTA",
        },
        {
          label: "Sexta",
          value: "SEXTA",
        },
        {
          label: "Sábado",
          value: "SÁBADO",
        },
        {
          label: "Domingo",
          value: "DOMINGO",
        },
      ]}
    />
  );
};

export default ReminderDay;
