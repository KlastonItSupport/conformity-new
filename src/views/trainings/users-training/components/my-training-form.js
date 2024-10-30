import { Box, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { CalendarCustom } from "components/calendar";
import moment from "moment";
import { TrainingContext } from "providers/trainings";

const usersTrainingSchema = Yup.object().shape({
  date: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  trainingId: Yup.string().notOneOf(
    [""],
    "Por favor, selecione um Treinamento válido."
  ),
});

const MyTrainingForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const initialDateRef = useRef();
  const [isShowingCalendarCreate, setIsShowingCalendarCreate] = useState(false);
  const { getTrainings } = useContext(TrainingContext);
  const [trainingsOptions, setTrainingsOptions] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(usersTrainingSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    data.date = moment.utc(data.date, "DD/MM/YYYY").format("YYYY-MM-DD");
    if (event === "add") {
      const res = await onAdd(data);
      setLoading(false);
      onClose(res);
      return;
    }

    const res = await onEdit(data, id);

    setLoading(false);
    onClose(res);
  };

  const trainingNameInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Treinamento"}
        {...register("trainingId")}
        defaultValue={
          formValues && formValues.trainingId
            ? {
                label: formValues.trainingName,
                value: formValues.trainingId,
              }
            : {
                label: "Selecione um treinamento",
                value: "",
              }
        }
        options={trainingsOptions}
        errors={errors.trainingId}
      />
    </VStack>
  );

  const realizationDateInput = (
    <Box position="relative" w="100%">
      <FormInput
        ref={initialDateRef}
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
        label={"Data de inicio"}
        {...register("date")}
        onClick={() => setIsShowingCalendarCreate(!isShowingCalendarCreate)}
        width="100%"
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendarCreate(false);
        }}
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
  );

  useEffect(() => {
    getTrainings(1, "", 10000).then((trainings) => {
      setTrainingsOptions(
        trainings.items.map((training) => {
          return {
            label: training.name,
            value: training.id,
          };
        })
      );
    });
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
      {trainingNameInput}
      {realizationDateInput}
    </VStack>
  );
};

export default MyTrainingForm;
