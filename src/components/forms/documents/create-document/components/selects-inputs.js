import {
  Center,
  Container,
  Flex,
  HStack,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { Plus } from "@phosphor-icons/react";
import SelectInput from "components/select";
import { CategoryContext } from "providers/category";
import { DepartamentContext } from "providers/departament";
import React, { useContext, useEffect, useState } from "react";
import {} from "react-i18next";

const SelectsInputs = ({
  register,
  errors,
  onCategoryModalOpen,
  onDepartamentModalOpen,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { getCategories, categories, setCategories } =
    useContext(CategoryContext);

  const { getDepartaments, departaments, setDepartaments } =
    useContext(DepartamentContext);

  const handlingSelects = async () => {
    const [categoriesRes, departamentRes] = await Promise.all([
      getCategories(),
      getDepartaments(),
    ]);

    setCategories(
      categoriesRes.map((category) => {
        return { label: category.name, value: category.id };
      })
    );
    setDepartaments(
      departamentRes.map((departament) => {
        return { label: departament.name, value: departament.id };
      })
    );
    setIsLoading(false);
  };
  useEffect(() => {
    handlingSelects();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = (
    <Center marginTop={"30px"}>
      <Spinner color="primary.100" />
    </Center>
  );
  return (
    <>
      <SelectInput
        label="Projetos"
        {...register("project")}
        errors={errors.project}
        options={[
          {
            label: "Rigrabas",
            value: "ativo",
          },
          {
            label: "Unimed",
            value: "inativo",
          },
          {
            label: "Klaston",
            value: "inativo",
          },
        ]}
      />
      {!isLoading ? (
        <HStack
          w={"100%"}
          h={"100%"}
          alignContent={"center"}
          alignItems={"center"}
          margin="0 0 10px 0 "
        >
          <VStack w={"100%"} align={"start"}>
            <SelectInput
              label="Departamento"
              {...register("departamentId")}
              errors={errors.departamentId}
              options={departaments}
            />
          </VStack>
          <Flex
            bgColor={"primary.100"}
            cursor={"pointer"}
            style={{ marginTop: "40px" }}
            padding={"5px"}
          >
            <Plus
              color="white"
              size={20}
              weight="bold"
              onClick={onDepartamentModalOpen}
            />
          </Flex>
        </HStack>
      ) : (
        loading
      )}
      {!isLoading ? (
        <HStack>
          <VStack w={"100%"} align={"start"}>
            <SelectInput
              label="Categoria"
              {...register("categoryId")}
              errors={errors.categoryId}
              options={categories}
            />
          </VStack>
          <Container
            bgColor={"primary.100"}
            cursor={"pointer"}
            padding={"5px"}
            w={"30px"}
            height={"100%"}
            style={{ marginTop: "35px" }}
          >
            <Plus
              color="white"
              size={20}
              weight="bold"
              onClick={onCategoryModalOpen}
            />
          </Container>
        </HStack>
      ) : (
        loading
      )}
      <VStack marginTop={"10px"} alignItems={"start"}>
        <SelectInput
          label="Tipo"
          {...register("type")}
          errors={errors.type}
          options={[
            { label: "Interno", value: "intern" },
            { label: "Externo", value: "extern" },
          ]}
        />
      </VStack>
    </>
  );
};

export default SelectsInputs;
