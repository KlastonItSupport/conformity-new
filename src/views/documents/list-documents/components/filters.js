import { Box, HStack, VStack } from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { CalendarCustom } from "components/calendar";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import { useBreakpoint } from "hooks/usebreakpoint";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";

const Filters = () => {
  const [isShowingCalendarInitial, setIsShowingCalendarInitial] =
    useState(false);
  const [isShowingCalendarEnd, setIsShowingCalendarEnd] = useState(false);

  const { isMobile } = useBreakpoint();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({});

  const initialDateRef = useRef(null);
  const endDateRef = useRef(null);

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
          if (e.target.value.length === 10) setIsShowingCalendarInitial(false);
        }}
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
          if (e.target.value.length === 10) setIsShowingCalendarEnd(false);
        }}
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

  const departamentInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Departamento"
        options={[
          {
            label: "IT",
            value: "ativo",
          },
          {
            label: "RH",
            value: "rh",
          },
          {
            label: "Marketing",
            value: "marketing",
          },
          {
            label: "Vendas",
            value: "sales",
          },
          {
            label: "RH",
            value: "rh",
          },
        ]}
        key={"addCompany-status"}
      />
    </VStack>
  );

  const categoryInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Categoria"
        options={[
          {
            label: "IT",
            value: "ativo",
          },
          {
            label: "RH",
            value: "rh",
          },
          {
            label: "Marketing",
            value: "marketing",
          },
          {
            label: "Vendas",
            value: "sales",
          },
          {
            label: "RH",
            value: "rh",
          },
        ]}
        key={"addCompany-status"}
      />
    </VStack>
  );

  const authorInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Ex: Bruno Santos"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      innerPadding="10px 0"
      label="Autor"
      width="100%"
    />
  );
  return isMobile ? (
    <VStack w={"100%"} paddingX={"20px"}>
      <HStack mb={"30px "}>
        {initialDateInput}
        {finalDateInput}
      </HStack>

      {departamentInput}
      {categoryInput}
      {authorInput}
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
      />
    </VStack>
  ) : (
    <HStack
      justifyContent={"space-between"}
      w={"95%"}
      position="relative"
      pb={"20px"}
      alignItems={"center"}
    >
      {initialDateInput}
      {finalDateInput}
      {departamentInput}
      {categoryInput}
      {authorInput}
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
      />
    </HStack>
  );
};

export default Filters;
