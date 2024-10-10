import { Box, HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { useBreakpoint } from "hooks/usebreakpoint";
import TextEditor from "components/text-editor-mce";
import moment from "moment";
import { CalendarCustom } from "components/calendar";
import { useParams } from "react-router-dom";

const leadTaskSchema = Yup.object().shape({
  date: Yup.string().required("Data obrigatória"),
  type: Yup.string(),
  isReminder: Yup.string(),
  description: Yup.string(),
  time: Yup.string(),
});

const LeadTaskForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  leadTaskId,
}) => {
  const { isDesktop } = useBreakpoint();
  const [description, setDescription] = useState("");
  const richTextRef = useRef(null);
  const [isShowingCalendarEnd, setIsShowingCalendarEnd] = useState(false);
  const dateRef = useRef(null);
  const [timeOptions, setTimeOptions] = useState([]);
  const [isReminderState, setIsReminderState] = useState(false);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(leadTaskSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    if (data.date) {
      data.date = moment(data?.date, "DD/MM/YYYY").format("YYYY-MM-DD");
    }
    if (!data.isReminder) {
      delete data.time;
    }

    if (event === "add") {
      const res = await onAdd({
        ...data,
        description,
        leadId: id,
        isReminder: data.isReminder === "true" ? 1 : 0,
      });
      setLoading(false);
      onClose(res);
      return;
    }

    const res = await onEdit(leadTaskId, {
      ...data,
      description,
      isReminder: data.isReminder === "true" ? 1 : 0,
    });

    setLoading(false);
    onClose(res);
  };

  const reminderInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Lembrete? * "}
        {...register("isReminder")}
        error={errors.isReminder?.message}
        options={[
          {
            label: "Não",
            value: false,
          },
          {
            label: "Sim",
            value: true,
          },
        ]}
        defaultValue={
          formValues?.isReminder ? { label: "Sim", value: "true" } : null
        }
        onChange={(e) => {
          const value = e.target.value;
          setIsReminderState(value === "true" ? true : false);
        }}
      />
    </VStack>
  );

  const typeInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Tipo?"}
        {...register("type")}
        error={errors.type?.message}
        defaultValue={
          formValues?.type
            ? { label: formValues.type, value: formValues.type }
            : null
        }
        options={[
          {
            label: "Ligação",
            value: "Ligação",
          },
          {
            label: "WhatsApp",
            value: "WhatsApp",
          },
          {
            label: "E-mail",
            value: "E-mail",
          },
          {
            label: "Visita",
            value: "Visita",
          },
          {
            label: "Reunião",
            value: "Reunião",
          },
          {
            label: "Reunião Online",
            value: "Reunião Online",
          },
        ]}
      />
    </VStack>
  );

  const timeInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Horário"}
        {...register("time")}
        error={errors.time?.message}
        options={timeOptions}
        disabled={!isReminderState}
        cursor={!isReminderState ? "not-allowed" : "pointer"}
        defaultValue={
          formValues?.time
            ? { label: formValues.time, value: formValues.time }
            : null
        }
      />
    </VStack>
  );
  const dateInput = (
    <Box position="relative" w="100%">
      <FormInput
        ref={dateRef}
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        margin={{
          lg: "20px 0 20px 0 ",
          sm: "0 0 10px 0 ",
        }}
        placeholder="dd/mm/yyyy"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Data de término"}
        onClick={() => setIsShowingCalendarEnd(!isShowingCalendarEnd)}
        width="100%"
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendarEnd(false);
        }}
        {...register("date")}
        error={errors.date?.message}
        defaultValue={
          formValues && formValues.date
            ? moment(formValues.date).format("DD/MM/YYYY")
            : null
        }
      />
      {isShowingCalendarEnd && (
        <Box position={"absolute"} top="80%" left={0} zIndex={3} w="100%">
          <CalendarCustom
            onChangeDate={(date) => {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();

              const formattedDate = `${day}/${month}/${year}`;

              setValue("date", formattedDate);
              setIsShowingCalendarEnd(!isShowingCalendarEnd);
            }}
          />
        </Box>
      )}
    </Box>
  );

  const handlingTimeInputOptions = () => {
    const options = [];

    for (let hour = 0; hour < 23; hour++) {
      const zeroMinutesLabel = `${hour <= 9 ? `0${hour}` : hour}:00`;
      const fifteenMinutesLabel = `${hour <= 9 ? `0${hour}` : hour}:15`;
      const thirtyMinutesLabel = `${hour <= 9 ? `0${hour}` : hour}:30`;
      const fortyFiveMinutesLabel = `${hour <= 9 ? `0${hour}` : hour}:45`;
      options.push({
        label: zeroMinutesLabel,
        value: zeroMinutesLabel,
      });
      options.push({
        label: fifteenMinutesLabel,
        value: fifteenMinutesLabel,
      });
      options.push({
        label: thirtyMinutesLabel,
        value: thirtyMinutesLabel,
      });
      options.push({
        label: fortyFiveMinutesLabel,
        value: fortyFiveMinutesLabel,
      });
    }

    setTimeOptions(options);
  };

  useEffect(() => {
    handlingTimeInputOptions();

    if (formValues) {
      setDescription(formValues.description);
      setIsReminderState(formValues.isReminder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      {isDesktop ? (
        <HStack w={"100%"} justifyContent={"space-between"}>
          {dateInput}
          {reminderInput}
        </HStack>
      ) : (
        <VStack align={"start"} w={"100%"} mt={"5px"}>
          {dateInput}
          {reminderInput}
        </VStack>
      )}
      {isDesktop ? (
        <HStack w={"100%"}>
          {typeInput}
          {timeInput}
        </HStack>
      ) : (
        <VStack align={"start"} w={"100%"} mt={"5px"}>
          {typeInput}
          {timeInput}
        </VStack>
      )}

      <TextEditor
        value={description}
        onChange={setDescription}
        ref={richTextRef}
      />
    </VStack>
  );
};

export default LeadTaskForm;
