import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import { ModalForm } from "components/components";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ChecklistForm from "./checklist-form";
import { useTranslation } from "react-i18next";
import { X } from "@phosphor-icons/react";
import { api } from "api/api";
import { toast } from "react-toastify";

export const SubtaskModal = ({
  isOpen,
  onClose,
  modalSize = "xl",
  isLoading = false,
  subtask,
  setTaskProgress,
}) => {
  const [checklist, setChecklist] = useState([]);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);
  const formRef = useRef(null);
  const { t } = useTranslation();

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const getCheckList = async (id) => {
    try {
      const response = await api.get(`/tasks-details/check-list/${id}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  const createCheckList = async (data) => {
    try {
      const response = await api.post(`/tasks-details/check-list`, {
        ...data,
        subtaskId: subtask.id,
      });

      if (response.status === 201) {
        toast.success("Checklist criado com sucesso");
        setChecklist([...checklist, response.data]);
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar Checklist");
    }
  };

  const onCheckItem = async (id) => {
    try {
      const response = await api.get(
        `tasks-details/check-list/handle-complete-checklist/${id}`
      );

      if (response.status === 200) {
        toast.success("Checklist atualizado com sucesso");
        setChecklist(
          checklist.map((item) => {
            if (item.id === id) {
              return { ...item, isCompleted: !item.isCompleted };
            }
            return item;
          })
        );

        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao atualizar Checklist");
    }
  };

  const deleteCheckItem = async (id) => {
    try {
      const response = await api.delete(`tasks-details/check-list/${id}`);

      if (response.status === 200) {
        toast.success("Checklist excluído com sucesso");
        setChecklist(checklist.filter((item) => item.id !== id));
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao excluir Checklist");
    }
  };

  useEffect(() => {
    getCheckList(subtask.id).then((res) => {
      setChecklist(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isAllChecked = checklist.every((item) => item.isCompleted === true);
    if (isAllChecked && checklist.length > 0) {
      setTaskProgress(subtask.id, true);
      return;
    }

    const hasOneNotChecked = checklist.some(
      (item) => item.isCompleted === false
    );

    if (hasOneNotChecked) {
      setTaskProgress(subtask.id, false);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checklist]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={modalSize}
        trapFocus={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes da Subtarefa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems={"start"} w={"100%"} mb={"20px"}>
              <Text fontSize={"large"} fontWeight={"bold"}>
                {subtask.title}
              </Text>
              <HStack w={"100%"} justifyContent={"space-between"}>
                <HStack margin={"0px"} p={"0px"}>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    Data de Início:
                  </Text>
                  <Text fontSize={"md"}>
                    {moment.utc(subtask.initialDate).format("DD/MM/YYYY")}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    Data de Término
                  </Text>
                  <Text fontSize={"md"}>
                    {moment.utc(subtask.endDate).format("DD/MM/YYYY")}
                  </Text>
                </HStack>
              </HStack>
              <Text fontSize={"initial"} my={"20px"}>
                <Text as={"span"} fontSize={"initial"} fontWeight={"bold"}>
                  Descrição:
                </Text>{" "}
                {subtask.description}
              </Text>
              <VStack alignItems={"start"} w={"100%"}>
                <HStack justifyContent={"space-between"} w={"100%"}>
                  <Text fontSize={"large"} fontWeight={"bold"}>
                    Check List
                  </Text>
                  <Text
                    fontSize={"md"}
                    color={"primary.100"}
                    cursor={"pointer"}
                    onClick={onAddModalOpen}
                  >
                    Adicionar novo item
                  </Text>
                </HStack>
                {checklist && checklist.length > 0 ? (
                  checklist.map((item, index) => (
                    <HStack key={index} w={"100%"} justify={"space-between"}>
                      <Checkbox
                        isChecked={item.isCompleted}
                        onChange={async () => {
                          await onCheckItem(item.id);
                        }}
                      >
                        {item.name}
                      </Checkbox>
                      <X
                        size={18}
                        color="primary.100"
                        cursor="pointer"
                        onClick={() => deleteCheckItem(item.id)}
                      />
                    </HStack>
                  ))
                ) : (
                  <Text fontSize={"md"} color={"gray.500"}>
                    Nenhum item na checklist.
                  </Text>
                )}
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <ChecklistForm
            formRef={formRef}
            onClose={onAddModalClose}
            onAdd={createCheckList}
            setIsLoading={setIsLoadingChecklist}
          />
        }
        formRef={formRef}
        title={t("Adicionar Checklist")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={isLoadingChecklist}
      />
    </>
  );
};
