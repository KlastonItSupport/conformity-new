import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { revisionEditSchema } from "./schemas/revisions-edit.schema";
import { useForm } from "react-hook-form";
import { FormTextArea } from "components/components";
import { FormInput } from "components/components";
import { CalendarCustom } from "components/calendar";
import { Box } from "@chakra-ui/react";
import moment from "moment";

const RevisionsForm = ({
  onClose,
  formRef,
  event = "edit",
  submitFunc,
  defaultValues,
}) => {
  const [isShowingCalendar, setIsShowingCalendar] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(revisionEditSchema),
  });

  const onSubmit = async (data) => {
    if (event === "add") {
      submitFunc(data);
      onClose();
      return;
    }
    submitFunc(data);
    onClose();
  };

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormTextArea
        label={"Descrição da revisão"}
        {...register("description")}
        error={errors.description?.message}
        defaultValue={defaultValues?.description}
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
        label={"Data"}
        onClick={() => setIsShowingCalendar(!isShowingCalendar)}
        width="100%"
        autocomplete="off"
        {...register("revisionDate")}
        error={errors.revisionDate?.message}
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendar(false);
        }}
        defaultValue={moment(defaultValues?.revisionDate).format("DD/MM/YYYY")}
      />
      {isShowingCalendar && (
        <Box
          position={"absolute"}
          top={{ lg: "305px", md: "410px", sm: "300px" }}
          zIndex={2}
          w={{ sm: "80%" }}
        >
          <CalendarCustom
            onChangeDate={(date) => {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();

              const formattedDate = `${day}/${month}/${year}`;

              setValue("revisionDate", formattedDate);
              setIsShowingCalendar(!isShowingCalendar);
            }}
          />
        </Box>
      )}
    </form>
  );
};

export default RevisionsForm;
