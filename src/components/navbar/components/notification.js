import React, { useContext, useEffect, useState } from "react";
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
import { BlogContext } from "providers/blog";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notificationsTotal, updateNotifications, notifications } =
    useContext(BlogContext);

  const navigate = useNavigate();

  useEffect(() => {
    updateNotifications();
  }, []);

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

          {notificationsTotal > 0 && (
            <>
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
                {notificationsTotal}
              </Badge>
            </>
          )}
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
                  cursor={"pointer"}
                  key={index}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  onClick={() => {
                    onClose();
                    navigate(`/companies/blog/post/${notification.id}`);
                  }}
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
