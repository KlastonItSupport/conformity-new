import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import tasksSchema from "./schema";
import { FormInput } from "components/components";
import { useTranslation } from "react-i18next";
import { HStack, Text, VStack } from "@chakra-ui/react";
import SelectInput from "components/select";
import TextEditor from "components/text-editor-mce";

const TaskForm = ({ formRef, onCloseModal, formValues, event = "add" }) => {
  const [description, setDescription] = useState("");
  const richTextRef = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(tasksSchema),
  });
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <form
      style={{ width: "100%" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Título"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Título *")}
        width="100%"
        {...register("title")}
        error={errors.title?.message}
        defaultValue={formValues?.name ?? ""}
      />
      <HStack w={"100%"}>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.status}
            label={t("Status")}
            options={[
              { label: "Aberta", value: "1" },
              { label: "Fechada", value: "2" },
            ]}
            defaultValue={{
              label: "Selecione um status",
              value: "not-selected",
            }}
            {...register("status")}
          />
        </VStack>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.project}
            label={t("Projeto")}
            options={[
              { label: "Qualidade", value: "1" },
              { label: "Compras", value: "2" },
              { label: "Admin", value: "3" },
            ]}
            defaultValue={{
              label: "Selecione um projeto",
              value: "not-selected",
            }}
            {...register("project")}
          />
        </VStack>
      </HStack>
      <HStack mt={"25px"}>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.prevision}
            label={t("Previsão de conclusão")}
            options={[{ label: "Previsão 1", value: "1" }]}
            defaultValue={{
              label: "Selecione uma previsão",
              value: "not-selected",
            }}
            {...register("prevision")}
          />
        </VStack>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.departament}
            label={t("Departamento")}
            defaultValue={{
              label: "Selecione um departamento",
              value: "not-selected",
            }}
            options={[{ label: "Previsão 1", value: "1" }]}
            {...register("departament")}
          />
        </VStack>
      </HStack>
      <HStack mt={"25px"}>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.origin}
            label={t("Origem")}
            defaultValue={{
              label: "Selecione uma Origem",
              value: "not-selected",
            }}
            options={[{ label: "Previsão 1", value: "1" }]}
            {...register("origin")}
          />
        </VStack>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.type}
            label={t("Tipo")}
            defaultValue={{
              label: "Selecione um tipo",
              value: "not-selected",
            }}
            options={[{ label: "Previsão 1", value: "1" }]}
            {...register("type")}
          />
        </VStack>
      </HStack>
      <HStack mt={"25px"}>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.classification}
            label={t("Classificação")}
            defaultValue={{
              label: "Selecione uma classificação",
              value: "not-selected",
            }}
            options={[{ label: "Previsão 1", value: "1" }]}
            {...register("classification")}
          />
        </VStack>
        <VStack w={"100%"} align={"start"}>
          <SelectInput
            errors={errors.evaluator}
            label={t("Adicionar um avaliador")}
            defaultValue={{
              label: "Selecione um Avaliador",
              value: "not-selected",
            }}
            options={[{ label: "Previsão 1", value: "1" }]}
            {...register("evaluator")}
          />
        </VStack>
      </HStack>
      <VStack p={0} alignItems={"start"} mt={"20px"} w={"100%"}>
        <Text>Descrição</Text>
        <TextEditor
          value={description}
          onChange={setDescription}
          ref={richTextRef}
        />
      </VStack>
    </form>
  );
};

export default TaskForm;
