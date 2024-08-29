import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormTextArea } from "components/components";
import { FormInput } from "components/components";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import UpArrow from "assets/img/up.png";
import DownArrow from "assets/img/down.png";
import { CalendarCustom } from "components/calendar";

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
  creationDate: Yup.string().required("A data de criação é obrigatória"),
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
      <SelectInput
        label={"Departamento * "}
        {...register("department")}
        error={errors.department?.message}
        defaultValue={{
          label: formValues?.department,
          value: formValues?.department,
        }}
        options={[
          { label: "Ciência e Tecnologia", value: "1" },
          { label: "Engenharia", value: "2" },
          { label: "Saúde", value: "3" },
          { label: "Educação", value: "4" },
        ]}
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
        defaultValue={{
          label: formValues?.frequency,
          value: formValues?.frequency,
        }}
        options={[
          { label: "Diário", value: "1" },
          { label: "Mensal", value: "2" },
          { label: "Bimensal", value: "3" },
          { label: "Trimestral", value: "4" },
          { label: "Semestral", value: "5" },
          { label: "Anual", value: "6" },
        ]}
      />

      <FormInput
        label={"Dia previsto de coleta * "}
        {...register("collectionDay")}
        error={errors.collectionDate?.message}
        defaultValue={formValues?.collectionDate}
        type="number"
      />
      <FormInput
        label={"Tolerância * "}
        {...register("tolerancy")}
        error={errors.tolerancy?.message}
        defaultValue={formValues?.tolerancy}
      />
      <SelectInput
        label={"Tipo de Dado: * "}
        {...register("dataType")}
        error={errors.dataType?.message}
        defaultValue={formValues?.dataType}
        options={[
          { label: "Numero inteiro", value: "1" },
          { label: "Peso", value: "2" },
          { label: "Volume", value: "3" },
          { label: "BRL", value: "4" },
          { label: "Percentual", value: "5" },
          { label: "USD", value: "6" },
          { label: "Percentual (%)", value: "7" },
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
          {...register("creationDate")}
          onClick={() => setIsShowingCalendarCreate(!isShowingCalendarCreate)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendarCreate(false);
          }}
          {...register("creationDate")}
          error={errors.creationDate?.message}
          // defaultValue={
          //   formValues.creationDate
          //     ? moment(formValues.creationDate).format(
          //         "DD/MM/YYYY"
          //       )
          //     : null
          // }
        />
        {isShowingCalendarCreate && (
          <Box position={"absolute"} top="80%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("creationDate", formattedDate);
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
