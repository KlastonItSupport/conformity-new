import { Box, HStack, Link, VStack } from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { CalendarCustom } from "components/calendar";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import { notSelectedCleaning } from "helpers/not-selected-cleaning";
import { sleep } from "helpers/sleep";
import { useBreakpoint } from "hooks/usebreakpoint";
import { set } from "lodash";
import moment from "moment";

import { IndicatorsAnswerContext } from "providers/indicator-answer";
import { IndicatorsContext } from "providers/indicators";
import { MatrizContext } from "providers/matriz";
import { TrainingContext } from "providers/trainings";
import { UserContext } from "providers/users";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";

export const filtersSchema = Yup.object().shape({
  userId: Yup.string(),
  trainingId: Yup.string(),
  initialDate: Yup.string(),
  endDate: Yup.string(),
});

const Filters = ({
  formDefaultValues,
  setTrainings,
  setPagination,
  setColumns,
}) => {
  const { isMobile } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingCalendarInitial, setIsShowingCalendarInitial] =
    useState(false);
  const initialDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userOptions, setUserOptions] = useState([]);
  const [trainingOptions, setTrainingOptions] = useState([]);

  const [isShowingCalendarEnd, setIsShowingCalendarEnd] = useState(false);
  const { getTrainings } = useContext(TrainingContext);
  const { getMatriz, handleTableColumns } = useContext(MatrizContext);
  const { getUsersFromThisCompany } = useContext(UserContext);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm(filtersSchema);

  const handlingSelects = async () => {
    const users = getUsersFromThisCompany(1, "", 1000);
    const trainings = getTrainings(1, "", 1000);

    await Promise.all([users, trainings]).then((data) => {
      setUserOptions(
        data[0].items.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })
      );

      setTrainingOptions(
        data[1].items.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })
      );
    });
  };

  const userInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Usuário"
        {...register("userId")}
        errors={errors.userId}
        defaultValue={{
          label: "Selecione um Usuário",
          value: "not-selected",
        }}
        options={userOptions}
        onChange={async (e) => {
          const indicatorId = e.target.value;
          const indicator = userOptions.find(
            (item) => item.value === Number(indicatorId)
          );

          // if (indicator) {
          //   setTitles({
          //     ...titles,
          //     dataType: indicator.dataType,
          //     frequency: indicator.frequency,
          //   });
          // }
        }}
      />
    </VStack>
  );

  const trainingInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Treinamento"
        {...register("trainingId")}
        errors={errors.trainingId}
        options={trainingOptions}
        onChange={async (e) => {
          const departamentId = e.target.value;
          const selectedOption = e.target.options[e.target.selectedIndex];
          const departamentLabel = selectedOption.text;

          if (departamentLabel !== "Selecione um Treinamento") {
            // setTitles({
            //   ...titles,
            //   department: departamentLabel,
            // });
          }

          // const indicators = await getIndicators(
          //   1,
          //   "",
          //   1000,
          //   departamentId === "not-selected" ? "" : departamentId
          // );
          // setUserOptions(
          //   indicators.items.map((item) => {
          //     return { label: item.goal, value: item.id };
          //   })
          // );
        }}
        defaultValue={{
          label: "Selecione um Treinamento",
          value: "not-selected",
        }}
      />
    </VStack>
  );

  const initialDateInput = (
    <Box position="relative" w="100%">
      <FormInput
        ref={initialDateRef}
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        margin="0 0 -16px 0 "
        placeholder="dd/mm/yyyy"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Data Inicial"}
        {...register("initialDate")}
        onClick={() => setIsShowingCalendarInitial(!isShowingCalendarInitial)}
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) {
            setIsShowingCalendarInitial(false);
            // try {
            //   const value = e.target.value;
            //   const initialDate = moment(value, "DD/MM/YYYY").format(
            //     "YYYY-MM-DD"
            //   );
            //   searchParams.set("initialDate", initialDate);
            //   setSearchParams(searchParams);
            // } catch (_) {}
          }
          if (e.target.value.length === 0) {
            searchParams.delete("initialDate");
            setSearchParams(searchParams);
          }
        }}
        defaultValue={formDefaultValues?.initialDate}
      />
      {isShowingCalendarInitial && (
        <Box position={"absolute"} top="20" left={0} zIndex={2} w="100%">
          <CalendarCustom
            onChangeDate={(date) => {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();

              const formattedDate = `${day}/${month}/${year}`;

              setValue("initialDate", formattedDate);
              setIsShowingCalendarInitial(!isShowingCalendarInitial);
            }}
          />
        </Box>
      )}
    </Box>
  );

  const finalDateInput = (
    <Box position="relative" w="100%">
      <FormInput
        ref={endDateRef}
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="dd/mm/yyyy"
        margin="0 0 -16px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={"Data Final"}
        {...register("endDate")}
        onClick={() => setIsShowingCalendarEnd(!isShowingCalendarEnd)}
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) {
            setIsShowingCalendarEnd(false);
            // try {
            //   const value = e.target.value;
            //   const endDate = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            //   searchParams.set("finalDate", endDate);
            //   setSearchParams(searchParams);
            // } catch (_) {}
          }
          if (e.target.value.length === 0) {
            searchParams.delete("finalDate");
            setSearchParams(searchParams);
          }
        }}
        defaultValue={formDefaultValues?.endDate}
      />
      {isShowingCalendarEnd && (
        <Box position={"absolute"} top="20" left={0} zIndex={2} w="100%">
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

  const onSubmit = async (data) => {
    notSelectedCleaning(data);
    setIsLoading(true);
    let initialFormatedDate;
    let finalFormatedDate;

    if (data.initialDate) {
      initialFormatedDate = moment(data.initialDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }

    if (data.endDate) {
      finalFormatedDate = moment(data.endDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }

    const res = await getMatriz(1, "", 1000, {
      initialDate: initialFormatedDate ?? "",
      finalDate: finalFormatedDate ?? "",
      trainingId: data.trainingId,
      userId: data.userId,
    });

    setTrainings(res.usersTrainings);
    setPagination(res.pages);
    setColumns(handleTableColumns(res.columnsName, setColumns));

    await sleep(1000);

    setIsLoading(false);
  };

  useEffect(() => {
    handlingSelects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isMobile ? (
    <VStack w={"95%"} as="form" onSubmit={handleSubmit(onSubmit)}>
      {trainingInput}
      {userInput}
      {initialDateInput}
      {finalDateInput}
      <ButtonPrimary
        fontSize="sm"
        fontWeight="bold"
        h="50"
        bgColor={"primary.100"}
        _hover={{ bgColor: "primary.200" }}
        textColor={"white"}
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
        borderRadius="7px"
        _active={{ bgColor: "primary.200" }}
        label={"Filtrar"}
        width="100%"
        m={"20px  20px !important"}
        isLoading={isLoading}
        type="submit"
      />
    </VStack>
  ) : (
    <HStack
      justifyContent={"space-between"}
      w={"95%"}
      position="relative"
      pb={"20px"}
      alignItems={"center"}
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      {userInput} {trainingInput}
      {initialDateInput}
      {finalDateInput}
      <ButtonPrimary
        fontSize="sm"
        fontWeight="bold"
        h="50"
        bgColor={"primary.100"}
        _hover={{ bgColor: "primary.200" }}
        textColor={"white"}
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
        borderRadius="7px"
        _active={{ bgColor: "primary.200" }}
        label={<MagnifyingGlass size={32} color={"white"} />}
        width="150px"
        mt={"35px !important"}
        type="submit"
        isLoading={isLoading}
      />
    </HStack>
  );
};

export default Filters;
