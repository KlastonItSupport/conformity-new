import { Box, HStack, VStack } from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { CalendarCustom } from "components/calendar";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import { notSelectedCleaning } from "helpers/not-selected-cleaning";
import { sleep } from "helpers/sleep";
import { useBreakpoint } from "hooks/usebreakpoint";
import moment from "moment";
import { DepartamentContext } from "providers/departament";
import { IndicatorsAnswerContext } from "providers/indicator-answer";
import { IndicatorsContext } from "providers/indicators";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";

export const filtersSchema = Yup.object().shape({
  departament: Yup.string(),
  indicator: Yup.string(),
  initialDate: Yup.string(),
  endDate: Yup.string(),
});

const Filters = ({
  formDefaultValues,
  showDepartament,
  id,
  titles,
  setTitles,
}) => {
  const { isMobile } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingCalendarInitial, setIsShowingCalendarInitial] =
    useState(false);
  const initialDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [indicatorsOptions, setIndicatorsOptions] = useState([]);
  const [departaments, setDepartaments] = useState([]);

  const [isShowingCalendarEnd, setIsShowingCalendarEnd] = useState(false);
  const { getIndicators } = useContext(IndicatorsContext);
  const { getIndicatorsAnswers } = useContext(IndicatorsAnswerContext);

  const { getDepartaments } = useContext(DepartamentContext);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm(filtersSchema);

  const handlingSelects = async () => {
    const departaments = getDepartaments();
    const indicators = getIndicators(1, "", 1000);

    await Promise.all([departaments, indicators]).then((data) => {
      setDepartaments(
        data[0].map((item) => {
          return { label: item.name, value: item.id };
        })
      );

      setIndicatorsOptions(
        data[1].items.map((item) => {
          return {
            label: item.goal,
            value: item.id,
            dataType: item.dataType,
            frequency: item.frequency,
          };
        })
      );
    });
  };

  const indicatorInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Indicador"
        {...register("indicator")}
        errors={errors.indicator}
        defaultValue={{
          label: "Selecione um Indicador",
          value: "not-selected",
        }}
        options={indicatorsOptions}
        onChange={async (e) => {
          const indicatorId = e.target.value;
          const indicator = indicatorsOptions.find(
            (item) => item.value === Number(indicatorId)
          );
          console.log("indicator", indicator);

          if (indicator) {
            setTitles({
              ...titles,
              dataType: indicator.dataType,
              frequency: indicator.frequency,
            });
          }
        }}
      />
    </VStack>
  );

  const departamentInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Departamento"
        {...register("departament")}
        errors={errors.departament}
        options={departaments}
        onChange={async (e) => {
          if (!showDepartament) return;
          const departamentId = e.target.value;
          const selectedOption = e.target.options[e.target.selectedIndex];
          const departamentLabel = selectedOption.text;

          if (departamentLabel !== "Selecione um departamento") {
            setTitles({
              ...titles,
              department: departamentLabel,
            });
          }

          const indicators = await getIndicators(
            1,
            "",
            1000,
            departamentId === "not-selected" ? "" : departamentId
          );
          setIndicatorsOptions(
            indicators.items.map((item) => {
              return { label: item.goal, value: item.id };
            })
          );
        }}
        defaultValue={{
          label: "Selecione um departamento",
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

    getIndicatorsAnswers(data.indicator ?? id, 1, "", 1000, {
      initialDate: initialFormatedDate ?? "",
      finalDate: finalFormatedDate ?? "",
    });
    await sleep(1000);

    setIsLoading(false);
  };

  useEffect(() => {
    handlingSelects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isMobile ? (
    <VStack
      w={"100%"}
      paddingX={"20px"}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {showDepartament && departamentInput}
      {showDepartament && indicatorInput}
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
        m={"10px  20px !important"}
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
      {showDepartament && departamentInput}
      {showDepartament && indicatorInput}
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
