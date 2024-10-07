import { Box, HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import moment from "moment";
import SelectInput from "components/select";
import { CalendarCustom } from "components/calendar";
import { useBreakpoint } from "hooks/usebreakpoint";
import TextEditor from "components/text-editor-mce";
import { CrmContext } from "providers/crm";

const contractSchema = Yup.object().shape({
  title: Yup.string(),
  status: Yup.string(),
  crmCompanyId: Yup.string(),
  initialDate: Yup.string(),
  finalDate: Yup.string(),
  value: Yup.string(),
  description: Yup.string(),
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
  const [clientTypeOptions, setClientTypeOptions] = useState([]);
  const richTextRef = useRef(null);
  const { isDesktop } = useBreakpoint();
  const { getCrm } = useContext(CrmContext);

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

    if (data.initialDate) {
      data.initialDate = moment(data?.initialDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }
    if (data.finalDate) {
      data.finalDate = moment(data.finalDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }

    if (event === "add") {
      const response = await onAdd({ ...data, text: description });
      setLoading(false);
      onClose(response);
      return;
    }

    const res = await onEdit(id, { ...data, text: description });
    setLoading(false);
    onClose(res);
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
        onClick={() => setIsShowingCalendarCreate(!isShowingCalendarCreate)}
        width="100%"
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendarCreate(false);
        }}
        {...register("initialDate")}
        error={errors.initialDate?.message}
        defaultValue={
          formValues && formValues.initialDate
            ? moment(formValues.initialDate).format("DD/MM/YYYY")
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

              setValue("initialDate", formattedDate);
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
        {...register("finalDate")}
        error={errors.finalDate?.message}
        defaultValue={
          formValues && formValues.finalDate
            ? moment(formValues.finalDate).format("DD/MM/YYYY")
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

              setValue("finalDate", formattedDate);
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
        defaultValue={{ label: "Iniciado", value: "iniciado" }}
        options={[
          {
            label: "Iniciado",
            value: "Iniciado",
          },
          {
            label: "Parado",
            value: "Parado",
          },
          {
            label: "Finalizado",
            value: "Finalizado",
          },
          {
            label: "Em andamento",
            value: "Em andamento",
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
        {...register("crmCompanyId")}
        error={errors.crmCompanyId?.message}
        options={clientTypeOptions}
        defaultValue={{
          label: "-",
          value: "not-selected",
        }}
      />
    </VStack>
  );

  useEffect(() => {
    setValue("status", "Iniciado");
    if (formValues) {
      getCrm(10000, "").then((crm) => {
        const options = crm.items.map((item) => {
          return { label: item.socialReason, value: item.id };
        });
        setClientTypeOptions(options);
        setValue("crmCompanyId", formValues.crmCompanyId);
      });
      setValue("status", formValues.status);
      setValue("startDate", moment(formValues.startDate).format("DD/MM/YYYY"));
      setValue("endDate", moment(formValues.endDate).format("DD/MM/YYYY"));
      setValue("value", formValues.value);
      setValue("progress", formValues.progress);
      setDescription(formValues.text);
    } else {
      getCrm(10000, "").then((crm) => {
        const options = crm.items.map((item) => {
          return { label: item.socialReason, value: item.id };
        });
        setClientTypeOptions(options);
      });
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
