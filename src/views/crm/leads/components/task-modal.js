import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { LeadTaskContext } from "providers/leads-task";
import React, { useContext, useEffect, useState } from "react";
import HtmlParser from "react-html-parser";

const TaskModal = ({ isOpen, onClose, id }) => {
  const [tasks, setTasks] = useState([]);
  const { getTaskByLeadId } = useContext(LeadTaskContext);

  useEffect(() => {
    getTaskByLeadId(id).then((res) => {
      setTasks(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tarefas relacionadas ao Lead</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxH={"500px"} overflowY={"scroll"}>
          <VStack alignItems={"start"}>
            {tasks.length === 0 && (
              <Text fontWeight={"normal"} fontSize={"lg"}>
                Ainda não há tarefas relacionadas ao Lead
              </Text>
            )}
            {tasks.map((task) => (
              <HStack key={task.id} margin={"10px 0px !important"}>
                <Text fontWeight={"bold"}>
                  {task.date && moment(task.date).format("DD/MM/YYYY")}
                </Text>
                <Text>{HtmlParser(task.description)}</Text>
              </HStack>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
