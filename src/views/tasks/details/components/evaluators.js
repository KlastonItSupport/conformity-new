import { HStack, Image, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { Trash } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { DeleteModal } from "components/components";
import { ModalForm } from "components/components";
import TaskEvaluator from "components/forms/tasks/task-evaluator/task-evaluator";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

const EvaluatorsTasks = ({ evaluators, onAddEvaluator, onDeleteEvaluator }) => {
  const { t } = useTranslation();
  const addEvaluatorFormRef = useRef();
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
            src={evaluator.picture}
            width={"40px"}
            height={"40px"}
            border={"2px solid"}
            borderRadius={"3px"}
            borderColor={"primary.100"}
            padding={"2px"}
          />
          <Text fontSize={"16px"} color={"header.100"}>
            {evaluator.name}
          </Text>
        </HStack>
        <Trash
          size={24}
          cursor={"pointer"}
          color="#0086FF"
          weight="fill"
          onClick={() => onDeleteModalOpen()}
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
          />
        </HStack>
        {evaluators.map((evaluator) => evaluatorBox(evaluator))}
      </VStack>
      <ModalForm
        isOpen={isAddEvaluatorModalOpen}
        onClose={onAddEvaluatorModalClose}
        form={
          <TaskEvaluator
            formRef={addEvaluatorFormRef}
            onClose={onAddEvaluatorModalClose}
          />
        }
        formRef={addEvaluatorFormRef}
        title={t("Adicionar Avaliador")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
      />
      <DeleteModal
        title={t("Excluir Avaliador")}
        subtitle={t("Tem certeza de que deseja excluir este avaliador?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          onDeleteModalClose();
        }}
      />
    </>
  );
};

export default EvaluatorsTasks;
