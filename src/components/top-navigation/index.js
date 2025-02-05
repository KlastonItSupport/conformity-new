import {
  Box,
  HStack,
  Button,
  useBreakpointValue,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { MagnifyingGlass, Plus, Download } from "@phosphor-icons/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Notification from "../navbar/components/notification";
import { useSidebar } from 'contexts/SidebarContext';

export const TopNavigation = ({ pageTitle }) => {
  const { isCollapsed } = useSidebar();
  const { t } = useTranslation();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const NavigationContent = () => (
    <HStack spacing={4}>
      <Notification />
    </HStack>
  );

  return (
    <Box
      as="nav"
      h={{ base: "auto", lg: "64px" }}
      px={6}
      py={3}
      position="fixed"
      top={0}
      right={0}
      left={{ base: isCollapsed ? "60px" : "240px", lg: isCollapsed ? "60px" : "240px" }}
      bg="white"
      boxShadow="sm"
      zIndex={100}
      transition="left 0.3s ease"
    >
      <HStack justify="space-between" h="100%">
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.700"
        >
          {pageTitle}
        </Text>

        {isDesktop ? (
          <NavigationContent />
        ) : (
          <>
            <Button onClick={onOpen} variant="ghost">
              <MagnifyingGlass size={24} />
            </Button>

            <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{t("Menu")}</DrawerHeader>
                <DrawerBody>
                  <Box p={4}>
                    <NavigationContent />
                  </Box>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </HStack>
    </Box>
  );
}; 