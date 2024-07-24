import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";
import * as Yup from "yup";
import { FormInput } from "components/components";
import moment from "moment";
import { CalendarCustom } from "components/calendar";
import { Box } from "@chakra-ui/react";
import { FormTextArea } from "components/components";

export const schema = Yup.object().shape({
  action: Yup.string().required("Ação obrigatória"),
  responsable: Yup.string().required("Responsável obrigatório"),
  data: Yup.string().required("Data obrigatória"),
  result: Yup.string().required("Resultado obrigatório"),
});

const CorrectiveActionsForm = ({
  formRef,
  onClose,
  setIsLoading,
  formValues,
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
    await sleep(250);
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
        label={"Ação corretiva"}
        {...register("action")}
        error={errors.action?.message}
        defaultValue={formValues?.action}
      />{" "}
      <FormTextArea
        label={"Resultado da ação corretiva"}
        {...register("result")}
        error={errors.result?.message}
        defaultValue={formValues?.result}
      />{" "}
      <FormInput
        label={"Responsável (s) pela ação corretiva"}
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
          {...register("data")}
          error={errors.data?.message}
          defaultValue={moment
            .utc(formValues?.data ?? new Date())
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

                setValue("data", formattedDate);
                setIsShowingCalendar(!isShowingCalendar);
              }}
            />
          </Box>
        )}
      </Box>
    </form>
  );
};

export default CorrectiveActionsForm;
