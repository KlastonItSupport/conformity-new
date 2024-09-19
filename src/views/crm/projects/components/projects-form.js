import { Box, HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import moment from "moment";
import { sleep } from "helpers/sleep";
import SelectInput from "components/select";
import { CalendarCustom } from "components/calendar";
import { useBreakpoint } from "hooks/usebreakpoint";
import TextEditor from "components/text-editor-mce";

const contractSchema = Yup.object().shape({
  documents: Yup.array().of(Yup.string().required("Required")),
  title: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  clientType: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  value: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const ProjectsForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const [isShowingCalendarCreate, setIsShowingCalendarCreate] = useState(false);
  const [isShowingCalendarEnd, setIsShowingCalendarEnd] = useState(false);
  const [description, setDescription] = useState("");
  const richTextRef = useRef(null);
  const { isDesktop } = useBreakpoint();
  const initialDateRef = useRef(null);
  const endDateRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(contractSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      sleep(1000);
      setLoading(false);
      onClose();
      return;
    }

    console.log("b0", data.departamentId);
    await onEdit();
    setLoading(false);
    onClose();
  };

  const initialDateInput = (
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
        {...register("date")}
        error={errors.date?.message}
        defaultValue={
          formValues && formValues.startDate
            ? moment(formValues.startDate).format("DD/MM/YYYY")
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

  const endDateInput = (
    <Box position="relative" w="100%">
      <FormInput
        ref={endDateRef}
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
        {...register("startDate")}
        error={errors.endDate?.message}
        defaultValue={
          formValues && formValues.endDate
            ? moment(formValues.endDate).format("DD/MM/YYYY")
            : null
        }
      />
      {isShowingCalendarEnd && (
        <Box position={"absolute"} top="80%" left={0} zIndex={2} w="100%">
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

  const statusInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Status * "}
        {...register("status")}
        error={errors.status?.message}
        options={[
          {
            label: "Ativo",
            value: "Ativo",
          },
          {
            label: "Inativo",
            value: "Inativo",
          },
          {
            label: "Cancelado",
            value: "Cancelado",
          },
        ]}
      />
    </VStack>
  );

  const progressInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <FormInput
        label={"Progresso"}
        {...register("progress")}
        error={errors.progress?.message}
        defaultValue={formValues?.progress}
      />
    </VStack>
  );

  const supplierInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Cliente / Fornecedor * "}
        {...register("clientType")}
        error={errors.clientType?.message}
        margin
        options={[
          {
            label: "-",
            value: "not-selected",
          },
          {
            label: "Ativo",
            value: "Ativo",
          },
          {
            label: "Inativo",
            value: "Inativo",
          },
          {
            label: "Cancelado",
            value: "Cancelado",
          },
        ]}
      />
    </VStack>
  );

  useEffect(() => {
    if (formValues) {
      setValue("status", formValues.status);
      setValue("startDate", formValues.startDate);
      setValue("endDate", formValues.endDate);
      setValue("value", formValues.value);
      setValue("progress", formValues.progress);
      setDescription(formValues.description);
    } else {
      setValue("status", "Ativo");
      setValue("clientType", "not-selected");
      setValue("progress", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Nome"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Título: "
        width="100%"
        {...register("title")}
        error={errors.title?.message}
        defaultValue={formValues?.title}
      />
      {supplierInput}
      {isDesktop ? (
        <HStack w={"100%"} justifyContent={"space-between"}>
          {statusInput}
          {progressInput}
        </HStack>
      ) : (
        <VStack align={"start"} w={"100%"} mt={"5px"}>
          {statusInput}
          {progressInput}
        </VStack>
      )}

      {isDesktop ? (
        <HStack w={"100%"} justifyContent={"space-between"} mt={"5px"}>
          {initialDateInput}
          {endDateInput}
        </HStack>
      ) : (
        <VStack align={"start"} w={"100%"} mt={"5px"}>
          {initialDateInput}
          {endDateInput}
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

export default ProjectsForm;
