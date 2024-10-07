import { Box, HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import moment from "moment";
import SelectInput from "components/select";
import { FormTextArea } from "components/components";
import { CalendarCustom } from "components/calendar";
import { useBreakpoint } from "hooks/usebreakpoint";
import { handlingMultipleFilesToBase64 } from "helpers/buffer-to-base-64";
import { CrmContext } from "providers/crm";

const contractSchema = Yup.object().shape({
  document: Yup.mixed(),
  title: Yup.string(),
  status: Yup.string(),
  crmCompaniesId: Yup.string(),
  initialDate: Yup.string(),
  endDate: Yup.string(),
  value: Yup.string(),
  description: Yup.string(),
});

const ContractForm = ({
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
  const { isDesktop } = useBreakpoint();
  const { getCrm } = useContext(CrmContext);
  const [clientTypeOptions, setClientTypeOptions] = useState([]);
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
    if (data.endDate) {
      data.endDate = moment(data.endDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    }

    if (data.document) {
      const files = await handlingMultipleFilesToBase64(data.document);
      data.document = files[0];
    }

    if (event === "add") {
      const response = await onAdd(data);
      setLoading(false);
      onClose(response);
      return;
    }

    const res = await onEdit({ ...data, id });
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
        {...register("initialDate")}
        onClick={() => setIsShowingCalendarCreate(!isShowingCalendarCreate)}
        width="100%"
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendarCreate(false);
        }}
        error={errors.date?.message}
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
        {...register("endDate")}
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

              setValue("endDate", formattedDate);
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
        error={errors.state?.message}
        defaultValue={
          formValues
            ? { label: formValues?.status, value: formValues?.status }
            : {
                label: "Selecione um status",
                value: "not-selected",
              }
        }
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

  const supplierInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Cliente / Fornecedor * "}
        {...register("crmCompaniesId")}
        error={errors.crmCompaniesId?.message}
        defaultValue={
          formValues
            ? {
                label: formValues?.clientSupplier,
                value: formValues?.crmCompaniesId,
              }
            : {
                label: "Selecione um cliente/fornecedor",
                value: "not-selected",
              }
        }
        margin
        options={clientTypeOptions}
      />
    </VStack>
  );

  const handlingClientTypeOptions = async () => {
    const crm = await getCrm(10000, "");
    const options = crm.items.map((item) => {
      return { label: item.socialReason, value: item.id };
    });

    setClientTypeOptions(options);
  };
  useEffect(() => {
    handlingClientTypeOptions();
  }, []);

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
        ms={{ base: "0px", md: "0px" }}
        type="file"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Insira seu documento"}
        className="center-file-input"
        {...register("document")}
        error={errors.document?.message}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Ex: Importação com a empresa X"
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
      {isDesktop ? (
        <HStack w={"100%"} justifyContent={"space-between"}>
          {statusInput}
          {supplierInput}
        </HStack>
      ) : (
        <VStack align={"start"} w={"100%"} mt={"5px"}>
          {statusInput}
          {supplierInput}
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
      <FormInput
        label={"Valor: * "}
        placeholder="EX: R$278"
        {...register("value")}
        error={errors.value?.message}
        defaultValue={formValues?.value}
      />
      <FormTextArea
        label={"Detalhes * "}
        placeholder="Descreve os detalhes do contrato, como por exemplo clausulas extremamente importantes"
        {...register("details")}
        error={errors.details?.message}
        defaultValue={formValues?.details}
        height={"125px"}
      />
    </VStack>
  );
};

export default ContractForm;
