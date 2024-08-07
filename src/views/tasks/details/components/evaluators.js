import { HStack, Image, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { Trash } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { DeleteModal } from "components/components";
import { ModalForm } from "components/components";
import TaskEvaluator from "components/forms/tasks/task-evaluator/task-evaluator";
import { DetailsTaskContext } from "providers/details-task";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import undefinedPic from "assets/img/undefined-pic.png";

const EvaluatorsTasks = ({ taskId, canAdd, canDelete }) => {
  const { t } = useTranslation();
  const addEvaluatorFormRef = useRef();
  const { getEvaluators, deleteEvaluator, addEvaluator } =
    useContext(DetailsTaskContext);
  const [evaluatorsList, setEvaluatorsList] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isAddEvaluatorModalOpen,
    onOpen: onAddEvaluatorModalOpen,
    onClose: onAddEvaluatorModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  useEffect(() => {
    getEvaluators(taskId).then((evaluators) => {
      setEvaluatorsList(evaluators);
    });
  }, []);

  const evaluatorBox = (evaluator) => {
    return (
      <HStack
        justifyContent={"space-between"}
        w={"100%"}
        borderBottom={"1px solid #ddd"}
        p={"5px 0px"}
      >
        <HStack>
          <Image
            src={evaluator.user?.profilePic ?? undefinedPic}
            width={"40px"}
            height={"40px"}
            border={"2px solid"}
            borderRadius={"3px"}
            borderColor={"primary.100"}
            padding={"2px"}
          />
          <Text fontSize={"16px"} color={"header.100"}>
            {evaluator.user?.name}
          </Text>
        </HStack>
        <Trash
          size={24}
          weight="fill"
          color={canDelete ? "#0086FF" : "#ddd"}
          cursor={canDelete ? "pointer" : "not-allowed"}
          onClick={
            canDelete
              ? () => {
                  setDeleteSelected(evaluator);
                  onDeleteModalOpen();
                }
              : null
          }
        />
      </HStack>
    );
  };
  return (
    <>
      <VStack
        alignItems={"start"}
        bgColor={"white"}
        border={"1px solid #ddd"}
        p={"20px"}
        mt={"20px"}
      >
        <HStack justify={"space-between"} w={"100%"} mb={"20px"}>
          <Text fontSize={"20px"} color={"header.100"}>
            Avaliadores:
          </Text>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Adicionar Avaliador"}
            padding={"15px"}
            h="40px"
            type="submit"
            onClick={onAddEvaluatorModalOpen}
            disabled={!canAdd}
          />
        </HStack>
        {evaluatorsList.map((evaluator) => evaluatorBox(evaluator))}
      </VStack>
      <ModalForm
        isOpen={isAddEvaluatorModalOpen}
        onClose={onAddEvaluatorModalClose}
        form={
          <TaskEvaluator
            formRef={addEvaluatorFormRef}
            onClose={async (usersIds) => {
              const response = await addEvaluator(taskId, usersIds);

              if (response) {
                setEvaluatorsList([...evaluatorsList, ...response]);
              }
              onAddEvaluatorModalClose();
            }}
            setLoading={setIsLoading}
          />
        }
        formRef={addEvaluatorFormRef}
        title={t("Adicionar Avaliador")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Avaliador")}
        subtitle={t("Tem certeza de que deseja excluir este avaliador?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);
          const evaluator = await deleteEvaluator(deleteSelected.id);

          if (evaluator) {
            setEvaluatorsList(
              evaluatorsList.filter(
                (evaluator) => evaluator.id !== deleteSelected.id
              )
            );
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default EvaluatorsTasks;
