import { Box, HStack, VStack } from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { CalendarCustom } from "components/calendar";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import { useQuery } from "hooks/query";
import { useBreakpoint } from "hooks/usebreakpoint";
import moment from "moment";
import { CategoryContext } from "providers/category";
import { DepartamentContext } from "providers/departament";
import { DocumentContext } from "providers/document";
import React, { useState, useRef, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";

export const filtersSchema = Yup.object().shape({
  initialDate: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  endDate: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  departamentId: Yup.string(),
  categoryId: Yup.string(),
  author: Yup.string(),
});

const Filters = () => {
  const [isShowingCalendarInitial, setIsShowingCalendarInitial] =
    useState(false);
  const [isShowingCalendarEnd, setIsShowingCalendarEnd] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const { departaments } = useContext(DepartamentContext);
  const { categories } = useContext(CategoryContext);
  const { getDocuments, setDocuments } = useContext(DocumentContext);

  const [formDefaultValues, setFormDefaultValues] = useState({});

  const { isMobile } = useBreakpoint();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm(filtersSchema);

  const initialDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    const defaults = {};

    if (queryParams.get("author")) {
      defaults.author = queryParams.get("author");
    }
    if (queryParams.get("initialDate")) {
      try {
        defaults.initialDate = moment(queryParams.get("initialDate")).format(
          "DD/MM/YYYY"
        );
      } catch (_) {}
    }
    if (queryParams.get("finalDate")) {
      try {
        defaults.endDate = moment(queryParams.get("finalDate")).format(
          "DD/MM/YYYY"
        );
      } catch (_) {}
    }

    if (queryParams.get("departamentId")) {
      try {
        const departament = departaments.find(
          (departament) =>
            departament.value === queryParams.get("departamentId")
        );
        if (departament) {
          defaults.departamentId = {
            label: departament.label,
            value: departament.value,
          };
        } else {
          defaults.departamentId = {
            label: "Selecione um departamento",
            value: "not-selected",
          };
        }
      } catch (_) {}
    } else {
      defaults.departamentId = {
        label: "Selecione um departamento",
        value: "not-selected",
      };
    }
    if (queryParams.get("categoryId")) {
      try {
        const category = categories.find(
          (category) => category.value === queryParams.get("categoryId")
        );
        if (category) {
          defaults.categoryId = {
            label: category.label,
            value: category.value,
          };
        } else {
          defaults.categoryId = {
            label: "Selecione uma categoria",
            value: "not-selected",
          };
        }
      } catch (_) {}
    } else {
      defaults.categoryId = {
        label: "Selecione uma categoria",
        value: "not-selected",
      };
    }

    setFormDefaultValues(defaults);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departaments, categories]);

  const initialDateInput = (
    <Box position="relative" w="100%">
      <FormInput
        ref={initialDateRef}
        variant="auth"
        fontSize="sm"
        type="text"
        margin="0"
        placeholder="dd/mm/yyyy"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor="primary.50"
        label="Data Inicial"
        width="100%"
        {...register("initialDate")}
        onClick={() => setIsShowingCalendarInitial(!isShowingCalendarInitial)}
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) {
            setIsShowingCalendarInitial(false);
          }
          if (e.target.value.length === 0) {
            searchParams.delete("initialDate");
            setSearchParams(searchParams);
          }
        }}
        defaultValue={formDefaultValues.initialDate}
      />
      {isShowingCalendarInitial && (
        <Box position="absolute" top="12" left={0} zIndex={2} w="100%">
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
        type="text"
        margin="0"
        placeholder="dd/mm/yyyy"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor="primary.50"
        label="Data Final"
        width="100%"
        {...register("endDate")}
        onClick={() => setIsShowingCalendarEnd(!isShowingCalendarEnd)}
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) {
            setIsShowingCalendarEnd(false);
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
            searchParams.delete("finalDate");
            setSearchParams(searchParams);
          }
        }}
        defaultValue={formDefaultValues.endDate}
      />
      {isShowingCalendarEnd && (
        <Box position="absolute" top="12" left={0} zIndex={2} w="100%">
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

  const departamentInput = formDefaultValues.departamentId && (
    <Box w="100%">
      <SelectInput
        label="Departamento"
        {...register("departamentId")}
        errors={errors.departamentId}
        options={[
          {
            label: "Selecione um departamento",
            value: "not-selected",
          },
          ...departaments,
        ]}
        defaultValue={formDefaultValues.departamentId}
        size="lg"
        bgColor="primary.50"
        margin="0"
        width="100%"
      />
    </Box>
  );
  
  const categoryInput = formDefaultValues.categoryId && (
    <Box w="100%">
      <SelectInput
        label="Categoria"
        {...register("categoryId")}
        errors={errors.categoryId}
        options={[
          {
            label: "Selecione um departamento",
            value: "not-selected",
          },
          ...categories,
        ]}
        defaultValue={formDefaultValues.categoryId}
        size="lg"
        bgColor="primary.50"
        margin="0"
        width="100%"
      />
    </Box>
  );
  
  const authorInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      type="text"
      placeholder="Ex: Bruno Santos"
      margin="0"
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor="primary.50"
      label="Autor"
      width="100%"
      {...register("author")}
      defaultValue={formDefaultValues.author}
    />
  );

  const onSubmit = async (data) => {
    if (data.author) {
      searchParams.set("author", data.author);
      setSearchParams(searchParams);
    }
    if (data.initialDate) {
      data.initialDate = moment(data?.initialDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );

      searchParams.set("initialDate", data.initialDate);
      setSearchParams(searchParams);
    }
    if (data.endDate) {
      data.finalDate = moment(data.endDate, "DD/MM/YYYY").format("YYYY-MM-DD");

      searchParams.set("finalDate", data.finalDate);
      setSearchParams(searchParams);
    }
    if (data.departamentId === "not-selected") {
      delete data.departamentId;
    } else {
      searchParams.set("departamentId", data.departamentId);
      setSearchParams(searchParams);
    }
    if (data.categoryId === "not-selected") {
      delete data.categoryId;
    } else {
      searchParams.set("categoryId", data.categoryId);
      setSearchParams(searchParams);
    }

    const res = await getDocuments(1, "", data);
    setDocuments(res.items);
  };
  return isMobile ? (
    <VStack w={"100%"} as="form">
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
        bgColor={"header.100"}
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
      w={"100%"}
      position="relative"
      pt={"30px"}
      pb={"10px"}
      alignItems={"center"}
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      {initialDateInput}
      {finalDateInput}
      {departamentInput}
      {categoryInput}
      {authorInput}
      <ButtonPrimary
        fontSize="sm"
        fontWeight=" "
        h="40px"
        bgColor={"header.100"}
        _hover={{ bgColor: "primary.200" }}
        textColor={"white"}
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
        borderRadius="7px"
        _active={{ bgColor: "primary.200" }}
        label={<MagnifyingGlass size={32} color={"white"} />}
        width="150px"
        mt={"35px !important"}
        type="submit"
      />
    </HStack>
  );
};

export default Filters;
