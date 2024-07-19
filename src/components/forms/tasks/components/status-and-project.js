import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import { Plus } from "@phosphor-icons/react";
import { CalendarCustom } from "components/calendar";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const StatusAndProject = ({ formValues, errors, register, setValue }) => {
  const { t } = useTranslation();
  const [isShowingCalendarInclusion, setIsShowingCalendarInclusion] =
    useState(false);
  const taskPrevisionDateRef = useRef(null);
  return (
    <>
      <VStack w={"100%"} align={"start"}>
        <SelectInput
          errors={errors.status}
          label={t("Status")}
          options={[
            { label: "Aberta", value: "Aberta" },
            { label: "Fechada", value: "Fechada" },
          ]}
          defaultValue={
            formValues?.status
              ? { label: formValues?.status, value: formValues?.statusId }
              : { label: "Selecione um status", value: "not-selected" }
          }
          {...register("status")}
        />
      </VStack>
      <Box position="relative" w="100%" mt={"20px"}>
        <FormInput
          ref={taskPrevisionDateRef}
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
          onClick={() =>
            setIsShowingCalendarInclusion(!isShowingCalendarInclusion)
          }
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10)
              setIsShowingCalendarInclusion(false);
          }}
          {...register("datePrevision")}
          error={errors.datePrevision?.message}
          defaultValue={moment
            .utc(formValues?.datePrevision ?? new Date())
            .format("DD/MM/YYYY")}
        />
        {isShowingCalendarInclusion && (
          <Box position={"absolute"} top="92%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("datePrevision", formattedDate);
                setIsShowingCalendarInclusion(!isShowingCalendarInclusion);
              }}
            />
          </Box>
        )}
      </Box>
      <HStack>
        <VStack w={"100%"} mt={"20px"} align={"start"}>
          <SelectInput
            errors={errors.project}
            label={t("Projeto")}
            options={[
              { label: "Qualidade", value: "1" },
              { label: "Compras", value: "2" },
              { label: "Admin", value: "3" },
            ]}
            defaultValue={
              formValues?.project
                ? { label: formValues?.project, value: formValues?.projectId }
                : { label: "Selecione um projeto", value: "not-selected" }
            }
            {...register("project")}
          />
        </VStack>
        <Flex
          bgColor={"primary.100"}
          cursor={"pointer"}
          // borderRadius={"50%"}
          style={{ marginTop: "60px" }}
          // onClick={onCreateGroupOpen}
          padding={"5px"}
        >
          <Plus color="white" size={20} weight="bold" />
        </Flex>
      </HStack>
    </>
  );
};

export default StatusAndProject;
