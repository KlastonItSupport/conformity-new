import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormInput } from "components/components";
import moment from "moment-timezone";

import { CalendarCustom } from "components/calendar";
import { Box } from "@chakra-ui/react";
import { FormTextArea } from "components/components";

export const schema = Yup.object().shape({
  action: Yup.string().required("Ação obrigatória"),
  responsable: Yup.string().required("Responsável obrigatório"),
  date: Yup.string().required("Data obrigatória"),
});

const ImediateActionsForm = ({
  formRef,
  onClose,
  setIsLoading,
  formValues,
  onAdd,
  onEdit,
  event = "add",
}) => {
  const dateRef = useRef(null);
  const [isShowingCalendar, setIsShowingCalendar] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const date = moment
      .tz(data.date, "DD/MM/YYYY", "America/Sao_Paulo")
      .format("YYYY-MM-DD");

    if (event === "edit") {
      await onEdit({ ...data, date });
    } else {
      await onAdd({ ...data, date });
    }

    setIsLoading(false);
    onClose();
  };

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormTextArea
        label={"Ação imediata ou bloqueio"}
        {...register("action")}
        error={errors.action?.message}
        defaultValue={formValues?.action}
      />{" "}
      <FormInput
        label={"Responsável"}
        {...register("responsable")}
        error={errors.responsable?.message}
        defaultValue={formValues?.responsable}
      />{" "}
      <Box position="relative" w="100%" mt={"20px"}>
        <FormInput
          ref={dateRef}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          placeholder="dd/mm/yyyy"
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          pl={"5px"}
          label={"Previsão"}
          onClick={() => setIsShowingCalendar(!isShowingCalendar)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendar(false);
          }}
          {...register("date")}
          error={errors.date?.message}
          defaultValue={moment
            .utc(formValues?.date ?? new Date())
            .format("DD/MM/YYYY")}
        />
        {isShowingCalendar && (
          <Box position={"absolute"} top="92%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("date", formattedDate);
                setIsShowingCalendar(!isShowingCalendar);
              }}
            />
          </Box>
        )}
      </Box>
    </form>
  );
};

export default ImediateActionsForm;
