import { FormInput } from "components/components";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FormTextArea } from "components/components";
import moment from "moment";
import { Box } from "@chakra-ui/react";
import { CalendarCustom } from "components/calendar";

export const extraDocumentsSchema = Yup.object().shape({
  title: Yup.string().required("Título da subtarefa obrigatório"),
  description: Yup.string(),
  initialDate: Yup.string().required("Data de Início obrigatório"),
  endDate: Yup.string().required("Data de Término obrigatório"),
});

const SubTaskForm = ({
  formRef,
  onClose,
  setIsLoading,
  formValues,
  createRelatedTask,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(extraDocumentsSchema),
  });

  const [isShowingCalendarInitial, setIsShowingCalendaInitial] =
    useState(false);

  const [isShowingCalendarFinal, setIsShowingCalendaFinal] = useState(false);
  const initialDateRef = useRef(null);
  const finalDateRef = useRef(null);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const initialDate = moment(data.initialDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    const finalDate = moment(data.endDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    data.initialDate = initialDate;
    data.endDate = finalDate;

    await createRelatedTask(data);

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
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Insira o titulo da subtarefa"}
        {...register("title")}
        error={errors.title?.message}
      />
      <FormTextArea
        label={"Descrição "}
        {...register("description")}
        error={errors.description?.message}
      />
      <Box position="relative" w="100%" mt={"20px"}>
        <FormInput
          ref={initialDateRef}
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
          label={"Data de Início"}
          onClick={() => setIsShowingCalendaInitial(!isShowingCalendarInitial)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendaInitial(false);
          }}
          {...register("initialDate")}
          error={errors.initialDate?.message}
          defaultValue={moment
            .utc(formValues?.initialDate ?? new Date())
            .format("DD/MM/YYYY")}
        />
        {isShowingCalendarInitial && (
          <Box position={"absolute"} top="92%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("initialDate", formattedDate);
                setIsShowingCalendaInitial(!isShowingCalendarInitial);
              }}
            />
          </Box>
        )}
      </Box>
      <Box position="relative" w="100%" mt={"20px"}>
        <FormInput
          ref={finalDateRef}
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
          label={"Data de Término"}
          onClick={() => setIsShowingCalendaFinal(!isShowingCalendarFinal)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendaFinal(false);
          }}
          {...register("endDate")}
          error={errors.endDate?.message}
          defaultValue={moment
            .utc(formValues?.endDate ?? new Date())
            .format("DD/MM/YYYY")}
        />
        {isShowingCalendarFinal && (
          <Box position={"absolute"} top="92%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("endDate", formattedDate);
                setIsShowingCalendaFinal(!isShowingCalendarFinal);
              }}
            />
          </Box>
        )}
      </Box>
    </form>
  );
};

export default SubTaskForm;
