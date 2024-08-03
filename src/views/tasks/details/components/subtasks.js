import {
  Box,
  HStack,
  Progress,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Check, MagnifyingGlass, Minus, Plus, X } from "@phosphor-icons/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AlertModal from "components/modals/alert-modal";
import { useTranslation } from "react-i18next";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import { DeleteModal } from "components/components";
import SubTaskForm from "./subtask-form";
import { SubtaskModal } from "./subtask-modal";
import { AuthContext } from "providers/auth";
import { api } from "api/api";
import { toast } from "react-toastify";
import { Trash } from "@phosphor-icons/react/dist/ssr";

const RelatedTasks = ({
  taskId,
  canDelete,
  canEdit,
  canAdd,
  setPercentage,
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [selectedComplete, setSelectedCompleted] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [selectedUndo, setSelectedUndo] = useState(null);
  const { getToken } = useContext(AuthContext);
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const { t } = useTranslation();
  const formRef = useRef(null);

  const {
    isOpen: isAlertModalOpen,
    onOpen: onAlertModalOpen,
    onClose: onAlertModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const {
    isOpen: isSubTaskModalOpen,
    onOpen: onSubTaskModalOpen,
    onClose: onSubTaskModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isUndoModalOpen,
    onOpen: onUndoModalOpen,
    onClose: onUndoModalClose,
  } = useDisclosure();

  const getRelatedTasks = async (id) => {
    try {
      const response = await api.get(`/tasks-details/related-task/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 200) {
        const completedTasks = response.data.filter(
          (task) => task.completed
        ).length;
        const totalTasks = response.data.length;
        const percentage =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        if (response.data.length === 0) {
          setPercentage(100);
        } else {
          setPercentage(percentage);
        }
        return response.data;
      }
    } catch (error) {}
  };

  const completeRelatedTask = async (id, showToast = true) => {
    try {
      const response = await api.get(
        `/tasks-details/related-task/complete-subtasks/${id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.status === 200) {
        if (showToast) {
          toast.success("Subtarefa concluída com sucesso");
        }
        setPercentage(); // Ajude a arrumar a porcentagem de
        setRelatedTasks(
          relatedTasks.map((task) =>
            task.id === id ? { ...task, completed: true } : task
          )
        );

        if (selectedSubTask && selectedSubTask.id === id) {
          setSelectedSubTask({ ...selectedSubTask, completed: true });
        }

        await getRelatedTasks(taskId);
        return response.data;
      }
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao concluir Subtarefa");
      }
    }
  };

  const uncompleteRelatedTask = async (id, showToast = true) => {
    try {
      const response = await api.get(
        `/tasks-details/related-task/uncomplete-subtasks/${id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.status === 200) {
        if (showToast) {
          toast.success("Subtarefa não concluída com sucesso");
        }
        setRelatedTasks(
          relatedTasks.map((task) =>
            task.id === id ? { ...task, completed: false } : task
          )
        );

        if (selectedSubTask && selectedSubTask.id === id) {
          setSelectedSubTask({ ...selectedSubTask, completed: false });
        }

        await getRelatedTasks(taskId);
        return response.data;
      }
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao não concluir Subtarefa");
      }
    }
  };

  const createRelatedTask = async (data) => {
    try {
      const response = await api.post(`/tasks-details/related-task`, {
        ...data,
        taskId,
      });

      if (response.status === 201) {
        toast.success("Subtarefa criada com sucesso");
        setRelatedTasks([...relatedTasks, response.data]);
        await getRelatedTasks(taskId);
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar Subtarefa");
    }
  };

  const deleteRelatedTask = async (id) => {
    try {
      const response = await api.delete(`/tasks-details/related-task/${id}`);

      if (response.status === 200) {
        toast.success("Subtarefa excluída com sucesso");
        setRelatedTasks(relatedTasks.filter((task) => task.id !== id));
        await getRelatedTasks(taskId);
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao excluir Subtarefa");
    }
  };

  useEffect(() => {
    getRelatedTasks(taskId).then((res) => {
      setRelatedTasks(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taskIcons = (details) => {
    return (
      <HStack alignItems={"center"}>
        <Box position="relative" width="100%">
          <Progress
            value={details.task.completed ? 100 : 0}
            size="md"
            color={"#0086FF"}
            bgColor={""}
            border={"3px solid #ddd"}
            width={"200px"}
            height={"20px"}
          />
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="black"
            fontSize="sm"
            fontWeight="bold"
          >
            {details.task.completed ? "100%" : "0%"}
          </Text>
        </Box>
        <MagnifyingGlass
          cursor={"pointer"}
          size={20}
          onClick={() => {
            setSelectedSubTask(details.task);
            onSubTaskModalOpen();
          }}
          title="Detalhes"
        />
        ,
        <Check
          size={20}
          cursor={"pointer"}
          onClick={() => {
            setSelectedCompleted(details);
            onAlertModalOpen();
          }}
          title="Marcar como concluída"
        />
        <X
          size={20}
          cursor={"pointer"}
          onClick={() => {
            setSelectedUndo(details.task);
            onUndoModalOpen();
          }}
          title="Desfazer progresso"
        />
        <Trash
          size={20}
          cursor={"pointer"}
          onClick={() => {
            setSelectedDelete(details.task);
            onDeleteModalOpen();
          }}
          title="Excluir"
        />
      </HStack>
    );
  };
  const task = (relatedTask) => (
    <VStack
      alignItems={"start"}
      border={"2px solid #ddd"}
      p={"10px"}
      borderRadius={"5px"}
      m={"5px 0px"}
    >
      <HStack justifyContent={"space-between"} w={"100%"}>
        <VStack alignItems={"start"} w={"100%"}>
          <Text fontWeight={"bold"}>{relatedTask.title}</Text>
        </VStack>
        {taskIcons({
          id: relatedTask.id,
          task: relatedTask,
        })}
      </HStack>
    </VStack>
  );

  return (
    <>
      <VStack
        alignItems={"start"}
        bgColor={"white"}
        border={"1px solid #ddd"}
        p={"20px"}
        mt={"20px"}
        mb={"20px"}
      >
        <HStack w={"100%"} justifyContent={"space-between"}>
          <Text fontSize={{ sm: "19px", md: "20px", lg: "24px" }}>
            Subtarefas
          </Text>
          {isShowing ? (
            <HStack onClick={() => setIsShowing(!isShowing)} cursor={"pointer"}>
              <Text fontSize={"16px"}>Mostrar menos</Text>

              <Minus
                size={20}
                color="gray.100"
                cursor={"pointer"}
                onClick={() => setIsShowing(!isShowing)}
              />
            </HStack>
          ) : (
            <HStack onClick={() => setIsShowing(!isShowing)} cursor={"pointer"}>
              <Text fontSize={"16px"}>Mostrar mais</Text>
              <Plus
                size={20}
                color="gray.100"
                cursor={"pointer"}
                onClick={() => setIsShowing(!isShowing)}
              />
            </HStack>
          )}
        </HStack>
        {isShowing && (
          <HStack justify={"flex-end"} w={"100%"}>
            <ButtonPrimary
              fontSize="sm"
              fontWeight="bold"
              bgColor={"primary.100"}
              _hover={{ bgColor: "primary.200" }}
              textColor={"white"}
              boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
              borderRadius="7px"
              _active={{ bgColor: "primary.200" }}
              type="submit"
              label={"Criar Subtarefa"}
              padding={"8px"}
              h="40px"
              onClick={onAddModalOpen}
              disabled={!canAdd}
            />
          </HStack>
        )}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isShowing ? 1 : 0,
            height: isShowing ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden", width: "100%" }}
        >
          {isShowing &&
            relatedTasks.length > 0 &&
            relatedTasks.map((taskInfo) => task(taskInfo))}
        </motion.div>
      </VStack>
      <AlertModal
        title={t("Concluir Tarefa Relacionada")}
        subtitle={t(
          "Ao marcar essa tarefa relacionada como concluída você também estará concluindo essa tarefa, o que afetará no progresso de sua tarefa atual e na tarefa na qual você está clicando. Tem certeza que deseja concluir essa tarefa relacionada?"
        )}
        isOpen={isAlertModalOpen}
        onClose={onAlertModalClose}
        onConfirm={async () => {
          setLoading(true);
          await completeRelatedTask(selectedComplete.id);
          setLoading(false);
          onAlertModalClose();
        }}
        isLoading={loading}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <SubTaskForm
            formRef={formRef}
            onClose={onAddModalClose}
            setIsLoading={setLoading}
            createRelatedTask={createRelatedTask}
          />
        }
        formRef={formRef}
        title={t("Criar Subtarefa")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        modalSize="2xl"
        isLoading={loading}
      />
      <DeleteModal
        title={t("Deletar  Subtarefa")}
        subtitle={t("Tem certeza de que deseja deletar esta subtarefa?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setLoading(true);
          await deleteRelatedTask(selectedDelete.id);
          setLoading(false);
          onDeleteModalClose();
        }}
        isLoading={loading}
      />

      <DeleteModal
        title={t("Desfazer progresso")}
        subtitle={t("Tem certeza de que deseja desfazer o progresso?")}
        isOpen={isUndoModalOpen}
        onClose={onUndoModalClose}
        onConfirm={async () => {
          setLoading(true);
          await uncompleteRelatedTask(selectedUndo.id);
          setLoading(false);
          onUndoModalClose();
        }}
        buttonLabel="Desfazer"
        isLoading={loading}
      />

      {isSubTaskModalOpen && (
        <SubtaskModal
          isOpen={isSubTaskModalOpen}
          onClose={onSubTaskModalClose}
          modalSize="xl"
          isLoading={loading}
          subtask={selectedSubTask}
          completeRelatedTask={completeRelatedTask}
          uncompleteRelatedTask={uncompleteRelatedTask}
        />
      )}
    </>
  );
};

export default RelatedTasks;
