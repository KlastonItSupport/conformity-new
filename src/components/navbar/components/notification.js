import React from "react";
import {
  VStack,
  Box,
  Text,
  Badge,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { Bell } from "@phosphor-icons/react";

const notifications = [
  {
    title: "Como adicionar ou remover avaliadores em uma tarefa (task)",
    description:
      "Neste vídeo você irá aprender como adicionar e/ou remover avaliadores em sua tarefa.",
    date: "11/10/2024",
  },
  {
    title: "Criando usuários no Conformity",
    description: "Aprenda como criar usuários no Conformity",
    date: "03/07/2020",
  },
  {
    title: "Nova tela de Gestão das Tasks",
    description: null,
    date: null,
  },
  {
    title: "Notificação 1",
    description: "Descrição da notificação 1",
    date: "01/01/2024",
  },
  {
    title: "Notificação 2",
    description: "Descrição da notificação 2",
    date: "02/02/2024",
  },
  {
    title: "Notificação 3",
    description: "Descrição da notificação 3",
    date: "03/03/2024",
  },
  {
    title: "Notificação 4",
    description: "Descrição da notificação 4",
    date: "04/04/2024",
  },
  {
    title: "Notificação 5",
    description: "Descrição da notificação 5",
    date: "05/05/2024",
  },
  {
    title: "Notificação 6",
    description: "Descrição da notificação 6",
    date: "06/06/2024",
  },
  {
    title: "Notificação 7",
    description: "Descrição da notificação 7",
    date: "07/07/2024",
  },
  {
    title: "Notificação 8",
    description: "Descrição da notificação 8",
    date: "08/08/2024",
  },
  {
    title: "Notificação 9",
    description: "Descrição da notificação 9",
    date: "09/09/2024",
  },
  {
    title: "Notificação 10",
    description: "Descrição da notificação 10",
    date: "10/10/2024",
  },
];

const Notification = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <VStack>
        <Box
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="50px"
          onClick={onOpen}
          cursor="pointer"
          role="button"
          borderRadius="full"
          zIndex={11}
          touchAction="manipulation"
        >
          <Bell size={28} color="#FFF" />
          <Badge
            position="absolute"
            top="-4"
            right="-1"
            fontSize="0.8em"
            colorScheme="whiteAlpha"
            bg="red"
            color="white"
            rounded="full"
          >
            {notifications.length}
          </Badge>
        </Box>
      </VStack>

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color={"red"} />
          <DrawerHeader borderBottomWidth="1px">Notificações</DrawerHeader>
          <DrawerBody overflowY="auto" maxH="80vh">
            <Stack spacing={4}>
              {notifications.map((notification, index) => (
                <Box
                  key={index}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text fontWeight="bold">{notification.title}</Text>
                  {notification.description && (
                    <Text fontSize="sm" color="gray.600">
                      {notification.description}
                    </Text>
                  )}
                  {notification.date && (
                    <Text fontSize="xs" color="gray.500">
                      {notification.date}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Notification;
