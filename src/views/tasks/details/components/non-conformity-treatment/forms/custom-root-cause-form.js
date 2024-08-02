import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";
import * as Yup from "yup";
import { FormInput } from "components/components";
import { Box } from "@chakra-ui/react";
import moment from "moment";
import { CalendarCustom } from "components/calendar";

export const schema = Yup.object().shape({
  why: Yup.string().required("Obrigatório"),
  answer: Yup.string().required("Obrigatório"),
  date: Yup.string().required("Data obrigatória"),
});

const CustomRootCauseForm = ({
  formRef,
  onClose,
  setIsLoading,
  formValues,
  event = "add",
  onEdit,
  onAdd,
}) => {
  const [isShowingCalendar, setIsShowingCalendar] = useState(false);
  const dateRef = useRef(null);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    if (event === "edit") {
      const date = moment(data.date, "DD/MM/YYYY").format("YYYY-MM-DD");
      await onEdit({ ...data, date });
      setIsLoading(false);
      onClose();
      return;
    }
    const date = moment(data.date, "DD/MM/YYYY").format("YYYY-MM-DD");
    await onAdd({ ...data, date });
    setIsLoading(false);
    onClose();
  };
  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormInput
        label={"Por que?"}
        {...register("why")}
        error={errors.why?.message}
        defaultValue={formValues?.why}
      />{" "}
      <FormInput
        label={"Resposta"}
        {...register("answer")}
        error={errors.answer?.message}
        defaultValue={formValues?.answer}
      />
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

export default CustomRootCauseForm;
