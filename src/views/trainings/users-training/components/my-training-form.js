import { Box, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { CalendarCustom } from "components/calendar";
import moment from "moment";

const contractSchema = Yup.object().shape({
  title: Yup.string(),
  status: Yup.string(),
  crmCompanyId: Yup.string(),
  startDate: Yup.string(),
  endDate: Yup.string(),
  value: Yup.string(),
  description: Yup.string(),
  contract: Yup.string(),
  solicitationMonth: Yup.string(),
  solicitationYear: Yup.string(),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(contractSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      const res = await onAdd(data);
      setLoading(false);
      onClose(res);
      return;
    }

    const res = await onEdit(id, data);

    setLoading(false);
    onClose(res);
  };

  const trainingNameInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Empresa"}
        {...register("trainingName")}
        error={errors.trainingName?.message}
        options={[
          {
            label: "Empresa 1",
            value: "Empresa 1",
          },
          {
            label: "Empresa 2",
            value: "Empresa 2",
          },
          {
            label: "Empresa 3",
            value: "Empresa 3",
          },
          {
            label: "Empresa 4",
            value: "Empresa 4",
          },
          {
            label: "Empresa 5",
            value: "Empresa 5",
          },
          {
            label: "Empresa 6",
            value: "Empresa 6",
          },
          {
            label: "Empresa 7",
            value: "Empresa 7",
          },
          {
            label: "Empresa 8",
            value: "Empresa 8",
          },
          {
            label: "Empresa 9",
            value: "Empresa 9",
          },
          {
            label: "Empresa 10",
            value: "Empresa 10",
          },
        ]}
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
        {...register("realizationDate")}
        onClick={() => setIsShowingCalendarCreate(!isShowingCalendarCreate)}
        width="100%"
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendarCreate(false);
        }}
        error={errors.date?.message}
        defaultValue={
          formValues && formValues.realizationDate
            ? moment(formValues.realizationDate).format("DD/MM/YYYY")
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

              setValue("realizationDate", formattedDate);
              setIsShowingCalendarCreate(!isShowingCalendarCreate);
            }}
          />
        </Box>
      )}
    </Box>
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    if (event === "edit") {
      setValue("companyName", formValues.companyName);
      setValue("school", formValues.school);
    }
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
