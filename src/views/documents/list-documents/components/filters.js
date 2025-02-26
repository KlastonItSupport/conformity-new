import { Box, HStack, VStack, Text } from "@chakra-ui/react";
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
        h="35px"
        margin="0"
        placeholder="dd/mm/yyyy"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor="primary.50"
        label="Data Inicial"
        width="100%"
        _hover={{ 
          bgColor: "gray.100",
          borderColor: "primary.200"
        }}
        _focus={{
          borderColor: "primary.300",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary-300)"
        }}
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
        h="35px"
        type="text"
        margin="0"
        placeholder="dd/mm/yyyy"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor="primary.50"
        label="Data Final"
        width="100%"
        _hover={{ 
          bgColor: "gray.100",
          borderColor: "primary.200"
        }}
        _focus={{
          borderColor: "primary.300",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary-300)"
        }}
        {...register("endDate")}
        onClick={() => setIsShowingCalendarEnd(!isShowingCalendarEnd)}
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) {
            setIsShowingCalendarEnd(false);
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
    <Box w="100%" h="100%">
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
        height="35px"
        _hover={{ 
          bgColor: "gray.100",
          borderColor: "primary.200"
        }}
        _focus={{
          borderColor: "primary.300",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary-300)"
        }}
        containerStyles={{ height: "100%" }}
      />
    </Box>
  );
  
  const categoryInput = formDefaultValues.categoryId && (
    <Box w="100%" h="100%">
      <SelectInput
        label="Categoria"
        {...register("categoryId")}
        errors={errors.categoryId}
        options={[
          {
            label: "Selecione uma categoria",
            value: "not-selected",
          },
          ...categories,
        ]}
        defaultValue={formDefaultValues.categoryId}
        size="lg"
        bgColor="primary.50"
        margin="0"
        width="100%"
        height="35px"
        containerStyles={{ height: "100%" }}
        _hover={{ 
          bgColor: "gray.100",
          borderColor: "primary.200"
        }}
        _focus={{
          borderColor: "primary.300",
          boxShadow: "0 0 0 1px var(--chakra-colors-primary-300)"
        }}
      />
    </Box>
  );
  
  const authorInput = (
    <FormInput
      variant="auth"
      fontSize="sm"
      type="text"
      h="35px"
      placeholder="Ex: Bruno Santos"
      margin="0"
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor="primary.50"
      label="Autor"
      width="100%"
      _hover={{ 
        bgColor: "gray.100",
        borderColor: "primary.200"
      }}
      _focus={{
        borderColor: "primary.300",
        boxShadow: "0 0 0 1px var(--chakra-colors-primary-300)"
      }}
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
    <VStack w="100%" as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
      <HStack w="100%" spacing={4}>
        {initialDateInput}
        {finalDateInput}
      </HStack>

      <Box w="100%">{departamentInput}</Box>
      <Box w="100%">{categoryInput}</Box>
      <Box w="100%">{authorInput}</Box>
      
      <Box minHeight="65px" alignItems="center" display="flex" w="100%" justifyContent="center">
        <ButtonPrimary
          variant="outline"
          borderColor="#3B5366"
          color="#3B5366"
          fontWeight="bold"
          h="35px"
          borderRadius="7px"
          bg="transparent"
          boxShadow="none"
          _hover={{ 
            bg: "#3B5366",
            color: "white",
            borderColor: "transparent"
          }}
          _active={{
            bg: "#3B5366",
            color: "white"
          }}
          label={
            <HStack spacing={2} justify="center" w="100%">
              <MagnifyingGlass size={18} weight="bold" />
              <Text fontSize="sm">Filtrar</Text>
            </HStack>
          }
          width="100%"
          type="submit"
          px={4}
        />
      </Box>
    </VStack>
  ) : (
    <HStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      w="100%"
      spacing={4}
      alignItems="flex-end"
    >
      <Box flex={1} minHeight="85px" alignItems="center" display="flex">
        {initialDateInput}
      </Box>
      <Box flex={1} minHeight="85px" alignItems="center" display="flex">
        {finalDateInput}
      </Box>
      <Box flex={1} minHeight="85px" alignItems="center" display="flex">
        {departamentInput}
      </Box>
      <Box flex={1} minHeight="85px" alignItems="center" display="flex">
        {categoryInput}
      </Box>
      <Box flex={1} minHeight="85px" alignItems="center" display="flex">
        {authorInput}
      </Box>
      <Box minHeight="65px" alignItems="center" display="flex" flexShrink={0}>
        <ButtonPrimary
          variant="outline"
          borderColor="#3B5366"
          color="#3B5366"
          h="35px"
          borderRadius="7px"
          bg="transparent"
          boxShadow="none"
          _hover={{ 
            bg: "#3B5366",
            color: "white",
            borderColor: "transparent"
          }}
          _active={{
            bg: "#3B5366",
            color: "white"
          }}
          label={
            <HStack spacing={2} justify="center" w="100%">
              <MagnifyingGlass size={18} weight="bold" />
              <Text fontSize="sm">Filtrar</Text>
            </HStack>
          }
          minW="120px"
          type="submit"
          px={4}
        />
      </Box>
    </HStack>
  );
};

export default Filters;
