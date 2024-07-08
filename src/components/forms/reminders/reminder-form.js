import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import reminderSchema from "./schema";
import StatusAndFrequency from "./components/status-and-frequency";
import TimeAndRepeat from "./components/time-and-repeat";
import { FormTextArea } from "components/components";
import DaysBoxes from "./components/days-boxes";
import ReminderDay from "./components/reminder-day";
import moment from "moment";

const ReminderForm = ({
  formRef,
  onClose,
  formValues,
  event = "add",
  onAdd,
  onEdit,
  id,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(reminderSchema),
    defaultValues: {
      days: [
        { label: "Domingo", value: "sunday", isChecked: false },
        { label: "Segunda", value: "monday", isChecked: false },
        { label: "Terça", value: "tuesday", isChecked: false },
        { label: "Quarta", value: "wednesday", isChecked: false },
        { label: "Quinta", value: "thursday", isChecked: false },
        { label: "Sexta", value: "friday", isChecked: false },
        { label: "Sábado", value: "saturday", isChecked: false },
      ],
    },
  });

  const [selectedFrequency, setSelectedFrequency] = useState("DIÁRIA");
  const [days, setDays] = useState(watch("days"));

  const formatDays = (days) => {
    return selectedFrequency === "DIÁRIA"
      ? {
          monday: days[0].isChecked ? 1 : 0,
          tuesday: days[1].isChecked ? 1 : 0,
          wednesday: days[2].isChecked ? 1 : 0,
          thursday: days[3].isChecked ? 1 : 0,
          friday: days[4].isChecked ? 1 : 0,
          saturday: days[5].isChecked ? 1 : 0,
          sunday: days[6].isChecked ? 1 : 0,
        }
      : null;
  };

  const onSubmit = async (data) => {
    if (event === "add") {
      const dataEnd = moment
        .utc(data.dataEnd, "DD/MM/YYYY")
        .format("YYYY-MM-DD");

      onAdd({
        ...data,
        dataEnd,
        module: "documentos",
        key: id,
        ...formatDays(days),
      });
      onClose();
      return;
    }
    const dataEnd = moment.utc(data.dataEnd, "DD/MM/YYYY").format("YYYY-MM-DD");

    onEdit({
      ...data,
      id,
      dataEnd,
      module: "documentos",
      key: id,
      ...formatDays(days),
    });
    onClose();
  };

  useEffect(() => {
    setValue("days", days);
  }, [days, setValue]);

  useEffect(() => {
    if (formValues) {
      setSelectedFrequency(formValues.frequency);
      if (formValues.frequency === "DIÁRIA") {
        console.log(formValues.saturday);
        setDays([
          { label: "Domingo", value: "sunday", isChecked: formValues.sunday },
          { label: "Segunda", value: "monday", isChecked: formValues.monday },
          { label: "Terça", value: "tuesday", isChecked: formValues.tuesday },
          {
            label: "Quarta",
            value: "wednesday",
            isChecked: formValues.wednesday,
          },
          {
            label: "Quinta",
            value: "thursday",
            isChecked: formValues.thursday,
          },
          { label: "Sexta", value: "friday", isChecked: formValues.friday },
          {
            label: "Sábado",
            value: "saturday",
            isChecked: formValues.saturday,
          },
        ]);
      }
      setValue("status", formValues.status);
      setValue("frequency", formValues.frequency);
      setValue("weekDay", formValues.weekDay);
      setValue("dataEnd", moment.utc(formValues.dataEnd).format("DD/MM/YYYY"));
      setValue("hour", formValues.hour);
      setValue("text", formValues.text);
      // setValue("key", formValues.key);
      // setValue("module", formValues.module);
      setValue("days", formValues.days);
    }
  }, []);

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <StatusAndFrequency
        register={register}
        errors={errors}
        setFrequency={setSelectedFrequency}
      />
      <TimeAndRepeat register={register} errors={errors} setValue={setValue} />
      <FormTextArea
        {...register("text")}
        error={errors.text?.message}
        label={"Descrição do Lembrete"}
      />
      {selectedFrequency === "DIÁRIA" && (
        <>
          <DaysBoxes
            days={days}
            setDays={setDays}
            error={errors.days?.message}
          />
        </>
      )}
      {(selectedFrequency === "SEMANAL" ||
        selectedFrequency === "ANUAL" ||
        selectedFrequency === "MENSAL") && (
        <ReminderDay register={register} errors={errors} />
      )}
    </form>
  );
};

export default ReminderForm;
