import {
  Box,
  HStack,
  Progress,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { NotePencil } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import { sleep } from "helpers/sleep";
import moment from "moment";
import React, { useRef, useState } from "react";
import ChangePrevisionForm from "./non-conformity-treatment/forms/prevision-form";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "hooks/usebreakpoint";

const Header = ({
  task,
  handleStatusChange,
  setTask,
  changeTaskPrevision,
  setPrevisionsList,
  canEdit,
  percentage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const formRef = useRef();
  const { isMobile } = useBreakpoint();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  let bgColor;

  if (task.status === "Aberta") {
    bgColor = "primary.100";
  } else if (task.status === "Fechada") {
    bgColor = "green.500";
  } else {
    bgColor = "red.600";
  }

  const statusBox = (
    <Box bgColor={bgColor} p={"10px 25px"} borderRadius={"5px"}>
      <Text fontSize={"16px"} fontWeight={"semibold"} color={"white"}>
        {task.status}
      </Text>
    </Box>
  );

  const label = (title, value, icon) => (
    <HStack
      borderRadius={"5px"}
      justifyContent={"space-between"}
      w={"100%"}
      borderBottom={"1px solid #ddd"}
      p={"2px 0px"}
    >
      <Text fontSize={"16px"} fontWeight={"semibold"}>
        {title}:
      </Text>
      <HStack>
        <Text fontSize={"16px"}>{value}</Text>
        {icon}
      </HStack>
    </HStack>
  );

  const actionButton = (
    <ButtonPrimary
      fontSize="sm"
      fontWeight="bold"
      bgColor={task.status === "Fechada" ? "red.600" : "primary.100"}
      textColor={"white"}
      boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
      borderRadius="7px"
      _hover={{
        bgColor: task.status === "Fechada" ? "red.700" : "primary.200",
      }}
      label={task.status === "Aberta" ? "Fechar tarefa" : "Reabrir tarefa"}
      padding={"5px"}
      w={"100%"}
      h="40px"
      type="submit"
      margin={"30px 0 10px 0px !important"}
      onClick={async () => {
        setIsLoading(true);

        await sleep(1000);
        const res = await handleStatusChange(task.id);

        setTask({ ...task, status: res.status });
        setIsLoading(false);
      }}
      isLoading={isLoading}
    />
  );

  return (
    <>
      <VStack
        alignItems={"start"}
        bgColor={"white"}
        border={"1px solid #ddd"}
        p={"20px"}
      >
        <HStack justify={"space-between"} w={"100%"}>
          <Text fontSize={"20px"} color={"header.100"}>
            TASK CÓDIGO: #{task.id}
          </Text>
          {!isMobile ? (
            <HStack>
              <Box position="relative" width="100%">
                <Progress
                  value={percentage}
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
                  {`${parseInt(percentage)}%`}
                </Text>
              </Box>
              {statusBox}
            </HStack>
          ) : (
            <VStack alignItems={"end"} w={"100%"}>
              <Box position="relative" width="100%">
                <Progress
                  value={percentage}
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
                  {`${parseInt(percentage)}%`}
                </Text>
              </Box>

              {statusBox}
            </VStack>
          )}
        </HStack>
        {label("Autor", task.responsable)}
        {label("Projeto", task.project)}
        {label("Origem", task.origin)}
        {label("Classificação", task.classification)}
        {label("Tipo", task.type)}
        {label(
          "Data Previsão",
          moment.utc(task.datePrevision).format("DD/MM/YYYY"),
          <NotePencil
            size={24}
            color={canEdit ? "#0086FF" : "#ddd"}
            cursor={canEdit ? "pointer" : "not-allowed"}
            onClick={canEdit ? onEditModalOpen : null}
          />
        )}
        {task.status !== "Reaberta" && actionButton}
      </VStack>
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <ChangePrevisionForm
            formRef={formRef}
            onClose={async (data) => {
              setIsLoading(true);
              const res = await changeTaskPrevision({
                ...data,
                taskId: task.id,
                oldDate: moment.utc(task.datePrevision).format("YYYY-MM-DD"),
                newDate: moment(data.data, "DD/MM/YYYY").format("YYYY-MM-DD"),
              });

              if (res) {
                setTask({ ...task, datePrevision: res.newDate });
                setPrevisionsList(res);
              }
              setIsLoading(false);
              onEditModalClose();
            }}
            setIsLoading={setIsLoading}
            formValues={{ data: task.datePrevision }}
          />
        }
        formRef={formRef}
        title={t("Editar Previsão")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />
    </>
  );
};

export default Header;
