import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormTextArea } from "components/components";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import UpArrow from "assets/img/up.png";
import DownArrow from "assets/img/down.png";
import { CalendarCustom } from "components/calendar";
import { DepartamentContext } from "providers/departament";
import moment from "moment";
import { sleep } from "helpers/sleep";

const equipmentSchema = Yup.object().shape({
  departamentId: Yup.string().required("O Departamento é obrigatorio"),
  responsable: Yup.string().required("O responsável é obrigatório"),
  goal: Yup.string().required("O objetivo é obrigatório"),
  whatToMeasure: Yup.string().required("O que mede é obrigatório"),
  howToMeasure: Yup.string().required("Como mede é obrigatório"),
  frequency: Yup.string().required("A frequência é obrigatória"),
  collectDay: Yup.number().required("O dia de coleta é obrigatório"),
  dataType: Yup.string().required("O tipo de dado é obrigatório"),
  meta: Yup.number()
    .typeError("A meta deve ser um número válido")
    .required("A meta é obrigatória"),
  deadline: Yup.string().required("A data de criação é obrigatória"),
});

const IndicatorForm = ({
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
  const [departamentsSelect, setDepartamentsSelect] = useState([]);
  const documentCreateDateRef = useRef(null);
  const { getDepartaments } = useContext(DepartamentContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(equipmentSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    const deadline = moment(data.deadline, "DD/MM/YYYY").format("YYYY-MM-DD");

    if (event === "add") {
      await onAdd({ ...data, direction: improveDirection, deadline });
      sleep(1000);
      setLoading(false);
      onClose();
      return;
    }

    await onEdit(
      {
        ...data,
        direction: improveDirection,
        deadline,
        departamentId: data.departamentId,
      },
      id
    );
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    getDepartaments().then((departaments) => {
      setDepartamentsSelect(
        departaments.map((departament) => {
          return { label: departament.name, value: departament.id };
        })
      );
    });

    if (formValues) {
      setImproveDirection(formValues.direction);
    }
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
      <SelectInput
        label={"Departamento * "}
        {...register("departamentId")}
        error={errors.departamentId?.message}
        defaultValue={
          formValues
            ? {
                label: formValues?.department,
                value: formValues?.departamentId,
              }
            : {
                label: "Selecione um departamento",
                value: "not-selected",
              }
        }
        options={departamentsSelect}
      />

      <FormInput
        label={"Responsável * "}
        {...register("responsable")}
        error={errors.responsable?.message}
        defaultValue={formValues?.responsable}
      />
      <FormTextArea
        label={"Objetivo *"}
        {...register("goal")}
        error={errors.goal?.message}
        defaultValue={formValues?.goal}
        height={"125px"}
      />
      <FormInput
        label={"O que mede?* "}
        {...register("whatToMeasure")}
        error={errors.whatToMeasure?.message}
        defaultValue={formValues?.whatToMeasure}
      />
      <SelectInput
        label={"Frequencia * "}
        {...register("frequency")}
        error={errors.frequency?.message}
        defaultValue={
          formValues
            ? {
                label: formValues?.frequency,
                value: formValues?.frequency.toUpperCase(),
              }
            : {
                label: "Selecione uma frequência",
                value: "not-selected",
              }
        }
        options={[
          { label: "Diário", value: "DIÁRIO" },
          { label: "Semanal", value: "SEMANAL" },
          { label: "Mensal", value: "MENSAL" },
          { label: "Bimensal", value: "BIMENSAL" },
          { label: "Trimestral", value: "TRIMESTRAL" },
          { label: "Semestral", value: "SEMESTRAL" },
          { label: "Anual", value: "ANUAL" },
        ]}
      />

      <FormInput
        label={"Dia previsto de coleta * "}
        {...register("collectDay")}
        error={errors.collectDay?.message}
        defaultValue={formValues?.collectDay}
        type="number"
      />

      <SelectInput
        label={"Tipo de Dado: * "}
        {...register("dataType")}
        error={errors.dataType?.message}
        defaultValue={{
          label: formValues?.dataType,
          value: formValues?.dataType.toUpperCase(),
        }}
        options={[
          { label: "Numero inteiro", value: "Numero inteiro" },
          { label: "Peso", value: "Peso" },
          { label: "Volume", value: "Volume" },
          { label: "BRL", value: "BRL" },
          { label: "Percentual", value: "Percentual" },
          { label: "USD", value: "USD" },
          { label: "Percentual (%)", value: "Percentual (%)" },
        ]}
      />
      <FormInput
        label={"Meta * "}
        {...register("meta")}
        error={errors.meta?.message}
        defaultValue={formValues?.meta}
      />
      <FormTextArea
        label="Como mede?"
        {...register("howToMeasure")}
        error={errors.howToMeasure?.message}
        defaultValue={formValues?.howToMeasure}
      />
      <Text>Escolha a direção do gráfico que representa melhoria</Text>
      <HStack w={"100%"}>
        <Image
          src={UpArrow}
          alt="up"
          height={"70px"}
          border={`3px solid ${improveDirection === "up" ? "#0086FF" : "#ddd"}`}
          borderRadius={"15px"}
          padding={"5px"}
          cursor={"pointer"}
          onClick={() => setImproveDirection("up")}
        />
        <Image
          src={DownArrow}
          alt="down"
          height={"70px"}
          border={`3px solid ${improveDirection === "down" ? "#0086FF" : "#ddd"}`}
          borderRadius={"15px"}
          padding={"5px"}
          cursor={"pointer"}
          onClick={() => setImproveDirection("down")}
        />
      </HStack>
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
          label={"Data de criação (Documento)"}
          {...register("deadline")}
          onClick={() => setIsShowingCalendarCreate(!isShowingCalendarCreate)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendarCreate(false);
          }}
          {...register("deadline")}
          error={errors.deadline?.message}
          defaultValue={
            formValues?.deadline
              ? moment(formValues.deadline).format("DD/MM/YYYY")
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

                setValue("deadline", formattedDate);
                setIsShowingCalendarCreate(!isShowingCalendarCreate);
              }}
            />
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default IndicatorForm;
