import { Box, HStack, Progress, Text, VStack } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { Check, MagnifyingGlass, Trash, X } from "@phosphor-icons/react";
import React from "react";
import { CSS } from "@dnd-kit/utilities";

const SubTaskCheckListItem = ({
  relatedTask,
  onSubTaskModalOpen,
  setSelectedSubTask,
  setSelectedCompleted,
  setSelectedUndo,
  setSelectedDelete,
  onAlertModalOpen,
  onUndoModalOpen,
  onDeleteModalOpen,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: relatedTask.id,
    });
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

  return (
    <VStack
      alignItems={"start"}
      border={"2px solid #ddd"}
      p={"10px"}
      borderRadius={"5px"}
      m={"5px 0px"}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      css={{ touchAction: "none" }}
      cursor={"grab"}
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
};

export default SubTaskCheckListItem;
