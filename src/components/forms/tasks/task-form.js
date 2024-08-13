import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import tasksSchema from "./schema";
import { FormInput } from "components/components";
import { useTranslation } from "react-i18next";
import { Box, Text, useDisclosure, VStack } from "@chakra-ui/react";
import TextEditor from "components/text-editor-mce";
import { TasksContext } from "providers/tasks";
import { DepartamentContext } from "providers/departament";
import moment from "moment";
import { CompanyContext } from "providers/company";
import { sleep } from "helpers/sleep";
import StatusAndProject from "./components/status-and-project";
import PrevisionAndDepartament from "./components/prevision-and-departament";
import OriginAndType from "./components/origin-and-type";
import ClassificationAndResponsable from "./components/classification-and-responsable";
import { ModalForm } from "components/components";
import OriginForm from "../origin/origin";
import TaskType from "../task-type/task-type";
import TaskClassification from "../task-classification/task-classification";
import DepartamentForm from "../departaments/create-departament";
import { AddUserForm } from "../components";
import { toast } from "react-toastify";

const TaskForm = ({
  formRef,
  onCloseModal,
  formValues,
  event = "add",
  setLoading,
}) => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const richTextRef = useRef(null);
  const originRef = useRef();
  const classificationRef = useRef();
  const typeRef = useRef();
  const departamentRef = useRef();
  const userRef = useRef();

  const { t } = useTranslation();
  const {
    getOrigins,
    getClassifications,
    getTypes,
    createTask,
    tasks,
    setTasks,
    editTask,
    origins,
    setOrigins,
    classifications,
    setClassifications,
    types,
    setTypes,
    departaments,
    setDepartaments,
    responsables,
    setResponsables,
  } = useContext(TasksContext);
  const { getDepartaments } = useContext(DepartamentContext);
  const { getCompanyUsers } = useContext(CompanyContext);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(tasksSchema),
  });

  const handlingSelects = async () => {
    const origins = getOrigins();
    const classifications = getClassifications(1, "", 1000);
    const types = getTypes();
    const departaments = getDepartaments();
    const companyUsers = getCompanyUsers();

    await Promise.all([
      origins,
      classifications,
      types,
      departaments,
      companyUsers,
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

      setResponsables(
        data[4].map((item) => {
          return { label: item.name, value: item.name };
        })
      );
    });
  };
  useEffect(() => {
    if (formValues && event !== "add") {
      setDescription(formValues.description);
    }
    handlingSelects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    if (event === "add") {
      const datePrevision = moment(data.datePrevision, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      const response = await createTask({
        ...data,
        datePrevision,
        description,
      });

      if (response) {
        setTasks([...tasks, response]);
        onCloseModal();
      }
      await sleep(1000);
      setLoading(false);
      return;
    }
    const datePrevision = moment(data.datePrevision, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    const response = await editTask({
      ...data,
      id: formValues.id,
      datePrevision,
      description,
    });

    if (response) {
      const tasksUpdated = tasks;
      const taskIndex = tasksUpdated.findIndex(
        (task) => task.id === response.id
      );

      tasksUpdated[taskIndex] = response;

      setTasks(tasksUpdated);
      setLoading(false);
      onCloseModal();
    }
  };

  const {
    isOpen: isOriginModalOpen,
    onOpen: onOriginModalOpen,
    onClose: onOriginModalClose,
  } = useDisclosure();

  const {
    isOpen: isTypeModalOpen,
    onOpen: onTypeModalOpen,
    onClose: onTypeModalClose,
  } = useDisclosure();

  const {
    isOpen: isClassificationModalOpen,
    onOpen: onClassificationModalOpen,
    onClose: onClassificationModalClose,
  } = useDisclosure();

  const {
    isOpen: isDepartamentModalOpen,
    onOpen: onDepartamentModalOpen,
    onClose: onDepartamentModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddUserModalOpen,
    onOpen: onAddUserModalOpen,
    onClose: onAddUserModalClose,
  } = useDisclosure();

  return (
    <>
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
          defaultValue={formValues?.title ?? ""}
        />
        <StatusAndProject
          formValues={formValues}
          errors={errors}
          register={register}
          setValue={setValue}
        />
        <PrevisionAndDepartament
          register={register}
          formValues={formValues}
          errors={errors}
          setValue={setValue}
          departaments={departaments}
          onDepartamentModalOpen={onDepartamentModalOpen}
        />
        <OriginAndType
          register={register}
          formValues={formValues}
          errors={errors}
          origins={origins}
          types={types}
          onOriginModalOpen={onOriginModalOpen}
          onTypeModalOpen={onTypeModalOpen}
        />
        <ClassificationAndResponsable
          register={register}
          formValues={formValues}
          errors={errors}
          classifications={classifications}
          responsables={responsables}
          onClassificationModalOpen={onClassificationModalOpen}
          onResponsableModalOpen={onAddUserModalOpen}
        />
        <VStack p={0} alignItems="start" mt="20px" w="100%" h="100%">
          <Text>Descrição</Text>
          <Box w="100%" flex="1">
            <TextEditor
              value={description}
              onChange={setDescription}
              ref={richTextRef}
            />
          </Box>
        </VStack>
      </form>

      <ModalForm
        isOpen={isOriginModalOpen}
        onClose={onOriginModalClose}
        form={
          <OriginForm
            formRef={originRef}
            onClose={(origin) => {
              setOrigins([
                ...origins,
                {
                  label: origin.name,
                  value: origin.id,
                },
              ]);
              onOriginModalClose();
            }}
            setLoading={setIsLoading}
          />
        }
        formRef={originRef}
        title={t("Criar Origem")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isTypeModalOpen}
        onClose={onTypeModalClose}
        form={
          <TaskType
            formRef={typeRef}
            onClose={(type) => {
              setTypes([
                ...types,
                {
                  label: type.name,
                  value: type.id,
                },
              ]);
              onTypeModalClose();
            }}
            setLoading={setIsLoading}
          />
        }
        formRef={typeRef}
        title={t("Criar Tipo")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isClassificationModalOpen}
        onClose={onClassificationModalClose}
        form={
          <TaskClassification
            formRef={classificationRef}
            onClose={(classification) => {
              setClassifications([
                ...classifications,
                {
                  label: classification.name,
                  value: classification.id,
                },
              ]);
              onClassificationModalClose();
            }}
            setLoading={setIsLoading}
          />
        }
        formRef={classificationRef}
        title={t("Criar Classificação")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isDepartamentModalOpen}
        onClose={onDepartamentModalClose}
        form={
          <DepartamentForm
            formRef={departamentRef}
            onClose={(departament) => {
              setDepartaments([
                ...departaments,
                {
                  label: departament.name,
                  value: departament.id,
                },
              ]);
              onDepartamentModalClose();
              toast.success(t("Departamento criado com sucesso"));
            }}
            setLoading={setIsLoading}
          />
        }
        formRef={departamentRef}
        title={t("Criar Departamento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isAddUserModalOpen}
        onClose={onAddUserModalClose}
        form={
          <AddUserForm
            formRef={userRef}
            onCloseModal={(user) => {
              setResponsables([
                ...responsables,
                {
                  label: user.name,
                  value: user.name,
                },
              ]);
              onAddUserModalClose();
            }}
            setLoading={setIsLoading}
          />
        }
        formRef={userRef}
        title={t("Criar Usuário")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={isLoading}
      />
    </>
  );
};

export default TaskForm;
