import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormTextArea } from "components/components";
import { FormInput } from "components/components";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { CalendarCustom } from "components/calendar";
import moment from "moment";

const equipmentSchema = Yup.object().shape({
  department: Yup.string().required("O Departamento é obrigatorio"),
  responsable: Yup.string().required("O responsável é obrigatório"),
  goal: Yup.string().required("O objetivo é obrigatório"),
  whatToMeasure: Yup.string().required("O que mede é obrigatório"),
  howToMeasure: Yup.string().required("Como mede é obrigatório"),
  frequency: Yup.string().required("A frequência é obrigatória"),
  collectionDay: Yup.number().required("O dia de coleta é obrigatório"),
  dataType: Yup.string().required("O tipo de dado é obrigatório"),
  meta: Yup.string().required("A meta é obrigatória"),
  date: Yup.string().required("A data de criação é obrigatória"),
});

const GraphItemForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const [improveDirection, setImproveDirection] = useState("");
  const [isShowingCalendarCreate, setIsShowingCalendarCreate] = useState(false);
  const documentCreateDateRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(equipmentSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      await onAdd({ ...data });
      setLoading(false);
      onClose();
      return;
    }

    await onEdit(data, id);
    setLoading(false);
    onClose();
  };

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      <FormInput
        label={"Meta * "}
        {...register("goal")}
        error={errors.goal?.message}
        defaultValue={formValues?.goal ?? ""}
      />
      <FormInput
        label={"Resposta * "}
        {...register("answer")}
        error={errors.answer?.message}
        defaultValue={formValues?.answer}
      />

      <Box position="relative" w="100%">
        <FormInput
          ref={documentCreateDateRef}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          margin="20px 0 20px 0 "
          placeholder="dd/mm/yyyy"
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label={"Data"}
          {...register("date")}
          onClick={() => setIsShowingCalendarCreate(!isShowingCalendarCreate)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendarCreate(false);
          }}
          {...register("date")}
          error={errors.date?.message}
          defaultValue={
            formValues && formValues.date
              ? moment(formValues.date).format("DD/MM/YYYY")
              : null
          }
        />
        {isShowingCalendarCreate && (
          <Box position={"absolute"} top="80%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("date", formattedDate);
                setIsShowingCalendarCreate(!isShowingCalendarCreate);
              }}
            />
          </Box>
        )}
      </Box>
      <FormTextArea
        label={"Justificativa * "}
        {...register("reason")}
        error={errors.reason?.message}
        defaultValue={formValues?.reason}
        heigh="200px"
      />
    </VStack>
  );
};

export default GraphItemForm;
