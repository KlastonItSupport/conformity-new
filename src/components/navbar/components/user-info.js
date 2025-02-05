import {
  useDisclosure,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  HStack,
  Link,
  Text,
  Box,
  Image,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import React from "react";
import { CaretDown } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const UserInfo = ({ 
  name, 
  profilePhoto, 
  companyName, 
  itemsList,
  isCollapsed 
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const color = isOpen ? "white" : "#87A3BC";
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <VStack spacing={3} align={isCollapsed ? "center" : "start"}>
      <Avatar
        size="md"
        name={name}
        src={profilePhoto}
        cursor="pointer"
      />
      
      {!isCollapsed && (
        <>
          <VStack spacing={1} align="start">
            <Text fontSize="sm" fontWeight="bold">
              {name}
            </Text>
            <Text fontSize="xs" color="gray.300">
              {companyName}
            </Text>
          </VStack>

          <Menu>
            <MenuButton w="100%">
              <HStack w="100%" justify="space-between">
                <Text fontSize="sm">{t("Menu")}</Text>
                <CaretDown size={16} />
              </HStack>
            </MenuButton>
            <MenuList bg="#3b5366" border="none">
              {itemsList.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={item.onClick || (() => navigate(item.src))}
                  bg="transparent"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                >
                  <Text fontSize="sm" color="white">
                    {item.label}
                  </Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </>
      )}
    </VStack>
  );
};