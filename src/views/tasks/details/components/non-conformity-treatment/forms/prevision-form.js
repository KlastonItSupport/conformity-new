import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";
import * as Yup from "yup";
import { FormInput } from "components/components";
import moment from "moment";
import { CalendarCustom } from "components/calendar";
import { Box } from "@chakra-ui/react";
import { FormTextArea } from "components/components";

export const schema = Yup.object().shape({
  data: Yup.string().required("Data obrigatória"),
  description: Yup.string().required("Descrição obrigatória"),
});

const ChangePrevisionForm = ({
  formRef,
  onClose,
  setIsLoading,
  formValues,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isShowingCalendar, setIsShowingCalendar] = useState(false);
  const dateRef = useRef(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    await sleep(250);
    await onClose(data);
    setIsLoading(false);
  };
  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <Box position="relative" w="100%" mt={"20px"}>
        <FormInput
          ref={dateRef}
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
          label={"Previsão"}
          onClick={() => setIsShowingCalendar(!isShowingCalendar)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendar(false);
          }}
          {...register("data")}
          error={errors.data?.message}
          defaultValue={moment
            .utc(formValues?.data ?? new Date())
            .format("DD/MM/YYYY")}
        />
        {isShowingCalendar && (
          <Box position={"absolute"} top="92%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("data", formattedDate);
                setIsShowingCalendar(!isShowingCalendar);
              }}
            />
          </Box>
        )}
      </Box>
      <FormTextArea
        label={"Descrição * "}
        {...register("description")}
        error={errors.description?.message}
        defaultValue={"Esta task necessita de mais prazo para sua conclusão"}
      />
    </form>
  );
};

export default ChangePrevisionForm;
