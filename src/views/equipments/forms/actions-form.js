import { Box, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarCustom } from "components/calendar";
import { FormInput } from "components/components";
import { handlingMultipleFilesToBase64 } from "helpers/buffer-to-base-64";
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const actionsSchema = Yup.object().shape({
  // title: Yup.string().required("O título é obrigatório"),
  type: Yup.string().required("O tipo é obrigatório"),
  validity: Yup.string(),
  date: Yup.string().required("A data é obrigatória"),
  nextDate: Yup.string().required("A data de próxima ação é obrigatória"),
});

const ActionForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const [isShowingCalendarDate, setIsShowingCalendarDate] = useState(false);
  const [isShowingCalendarNextDate, setIsShowingCalendarNextDate] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(actionsSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const nextDate = moment(data.nextDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    const date = moment(data.date, "DD/MM/YYYY").format("YYYY-MM-DD");
    if (event === "add") {
      const fileTreated = await handlingMultipleFilesToBase64(data.documents);
      await onAdd({
        ...data,
        documents: fileTreated,
        equipmentId: id,
        date,
        nextDate,
      });
      setLoading(false);
      onClose();
      return;
    }
    await onEdit({ ...data, nextDate, date }, formValues.id);
    onClose();
    setLoading(false);
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
        label={"Tipo * "}
        {...register("type")}
        error={errors.type?.message}
        defaultValue={formValues?.type}
      />
      {!formValues && (
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
          label={"Insira seus documentos"}
          {...register("documents")}
          multiple
          className="center-file-input"
          error={errors.documents?.message}
        />
      )}
      <FormInput
        label={"Validade "}
        {...register("validity")}
        error={errors.validity?.message}
        defaultValue={formValues?.validity}
      />

      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="dd/mm/yyyy"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Data *"}
        onClick={() => setIsShowingCalendarDate(!isShowingCalendarDate)}
        width="100%"
        autocomplete="off"
        {...register("date")}
        error={errors.date?.message}
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendarDate(false);
        }}
        defaultValue={moment(formValues?.date).format("DD/MM/YYYY")}
      />
      {isShowingCalendarDate && (
        <Box
          position={"absolute"}
          top={{ lg: "430px", md: "430px", sm: "430px" }}
          zIndex={2}
          w={{ sm: "80%" }}
        >
          <CalendarCustom
            onChangeDate={(date) => {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();

              const formattedDate = `${day}/${month}/${year}`;

              setValue("date", formattedDate);
              setIsShowingCalendarDate(!isShowingCalendarDate);
            }}
          />
        </Box>
      )}
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="dd/mm/yyyy"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Data da próxima ação *"}
        onClick={() => setIsShowingCalendarNextDate(!isShowingCalendarNextDate)}
        width="100%"
        autocomplete="off"
        {...register("nextDate")}
        error={errors.nextDate?.message}
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendarNextDate(false);
        }}
        defaultValue={moment(formValues?.nextDate).format("DD/MM/YYYY")}
      />
      {isShowingCalendarNextDate && (
        <Box
          position={"absolute"}
          top={{ lg: "525px", md: "520px", sm: "520px" }}
          zIndex={2}
          w={{ sm: "80%" }}
        >
          <CalendarCustom
            onChangeDate={(date) => {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();

              const formattedDate = `${day}/${month}/${year}`;

              setValue("nextDate", formattedDate);
              setIsShowingCalendarNextDate(!isShowingCalendarNextDate);
            }}
          />
        </Box>
      )}
    </VStack>
  );
};

export default ActionForm;
