import { HStack, VStack } from "@chakra-ui/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import SelectInput from "components/select";
import { notSelectedCleaning } from "helpers/not-selected-cleaning";
import { useBreakpoint } from "hooks/usebreakpoint";
import { DepartamentContext } from "providers/departament";
import { ProjectContext } from "providers/projects";
import { TasksContext } from "providers/tasks";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export const filtersSchema = Yup.object().shape({
  origin: Yup.string(),
  type: Yup.string(),
  classification: Yup.string(),
  status: Yup.string(),
  departament: Yup.string(),
});

const Filters = ({
  origins,
  classifications,
  types,
  departaments,
  setOrigins,
  setClassifications,
  setTypes,
  setDepartaments,
}) => {
  const { isMobile } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);
  const [projectOptions, setProjectsOptions] = useState([]);
  const { getOrigins, getClassifications, getTypes, getTasks, setTasks } =
    useContext(TasksContext);
  const { getDepartaments } = useContext(DepartamentContext);
  const { getProjects } = useContext(ProjectContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm(filtersSchema);

  const handlingSelects = async () => {
    const origins = getOrigins();
    const classifications = getClassifications();
    const types = getTypes();
    const departaments = getDepartaments();
    const projects = getProjects(1, "", 10000);

    await Promise.all([
      origins,
      classifications,
      types,
      departaments,
      projects,
    ]).then((data) => {
      setOrigins(
        data[0].items.map((item) => {
          return { label: item.name, value: item.id };
        })
      );
      setClassifications(
        data[1].items.map((item) => {
          return { label: item.name, value: item.id };
        })
      );
      setTypes(
        data[2].items.map((item) => {
          return { label: item.name, value: item.id };
        })
      );

      setDepartaments(
        data[3].map((item) => {
          return { label: item.name, value: item.id };
        })
      );
      setProjectsOptions(
        data[4].items.map((project) => {
          return { label: project.title, value: project.id };
        })
      );
    });
  };

  useEffect(() => {
    // setFormDefaultValues(queryParams);
    handlingSelects();
  }, []);

  const statusInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Status"
        {...register("status")}
        errors={errors.status}
        defaultValue={{
          label: "Selecione um status",
          value: "not-selected",
        }}
        options={[
          {
            label: "Aberta",
            value: "Aberta",
          },
          {
            label: "Fechada",
            value: "Fechada",
          },
          {
            label: "Reaberta",
            value: "Reaberta",
          },
        ]}
      />
    </VStack>
  );

  const originInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Origem "
        {...register("origin")}
        errors={errors.origin}
        defaultValue={{
          label: "Selecione uma origem",
          value: "not-selected",
        }}
        options={origins}
      />
    </VStack>
  );

  const classificationInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Classificação"
        {...register("classification")}
        errors={errors.classification}
        defaultValue={{
          label: "Selecione uma classificação",
          value: "not-selected",
        }}
        options={classifications}
      />
    </VStack>
  );

  const projectInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Projeto"
        {...register("projectId")}
        errors={errors.projectId}
        defaultValue={{
          label: "Selecione um projeto",
          value: "not-selected",
        }}
        options={projectOptions}
      />
    </VStack>
  );

  const typeInput = (
    <VStack w={"100%"} align={"start"}>
      <SelectInput
        label="Tipo"
        {...register("type")}
        errors={errors.type}
        options={types}
        defaultValue={{
          label: "Selecione um tipo",
          value: "not-selected",
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
        defaultValue={{
          label: "Selecione um tipo",
          value: "not-selected",
        }}
      />
    </VStack>
  );

  const onSubmit = async (data) => {
    notSelectedCleaning(data);
    setIsLoading(true);

    const tasks = await getTasks(1, "", data);

    setTasks(tasks.items);
    setIsLoading(false);
  };
  return isMobile ? (
    <VStack w={"100%"} paddingX={"20px"} as="form">
      {statusInput}
      {originInput}

      {classificationInput}
      {projectInput}
      {typeInput}
      {departamentInput}
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
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      {statusInput}
      {originInput}
      {classificationInput}
      {typeInput}
      {projectInput}
      {departamentInput}

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
