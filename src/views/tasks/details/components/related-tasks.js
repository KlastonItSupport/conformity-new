import { Box, HStack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { Check, MagnifyingGlass, Minus, Plus } from "@phosphor-icons/react";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import AlertModal from "components/modals/alert-modal";
import { useTranslation } from "react-i18next";
import { sleep } from "helpers/sleep";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import TaskForm from "components/forms/tasks/task-form";

const RelatedTasks = ({ relatedTasks }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [selectedTaskRelated, setSelectedTaskRelated] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const taskIcons = (details) => (
    <HStack>
      <Box w={"60px"} h={"60px"} mr={"20px"}>
        <CircularProgressbar
          value={details.progress}
          text={`${details.progress}%`}
          styles={buildStyles({
            pathColor: "#0086FF",
            textColor: "#0086FF",
          })}
        />
      </Box>
      <Check
        size={20}
        cursor={"pointer"}
        onClick={() => {
          setSelectedTaskRelated(details);
          onAlertModalOpen();
        }}
      />
      <MagnifyingGlass cursor={"pointer"} size={20} />,
    </HStack>
  );
  const task = (taskInfo) => (
    <VStack
      alignItems={"start"}
      border={"2px solid #ddd"}
      p={"10px"}
      borderRadius={"5px"}
      m={"5px 0px"}
    >
      <HStack justifyContent={"space-between"} w={"100%"}>
        <VStack alignItems={"start"} w={"100%"}>
          <Text fontWeight={"bold"}>{taskInfo.title}</Text>
          <Text>Responsável: {taskInfo.responsable}</Text>
        </VStack>
        {taskIcons({ id: taskInfo.id, progress: taskInfo.progress })}
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
            Tarefas Relacionadas
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
              label={"Criar Tarefa Relacionada"}
              padding={"8px"}
              h="40px"
              onClick={onAddModalOpen}
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
          {isShowing && relatedTasks.map((taskInfo) => task(taskInfo))}
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
          await sleep(500);
          setLoading(false);
          onAlertModalClose();
        }}
        isLoading={loading}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <TaskForm
            formRef={formRef}
            onCloseModal={onAddModalClose}
            setLoading={setLoading}
            origins={[]}
            classifications={[]}
            types={[]}
            departaments={[]}
            setOrigins={() => {}}
            setClassifications={() => {}}
            setTypes={() => {}}
            setDepartaments={() => {}}
          />
        }
        formRef={formRef}
        title={t("Criar Tarefa")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        modalSize="2xl"
        isLoading={loading}
      />
    </>
  );
};

export default RelatedTasks;
