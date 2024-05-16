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
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import React from "react";

export const UserInfo = ({ itemsList, name, companyName, profilePhoto }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const color = isOpen ? "white" : "#87A3BC";
  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        variant="ghost"
        mx={1}
        py={[1, 2, 2]}
        px={4}
        borderRadius={5}
        aria-label="Courses"
        fontWeight="normal"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        minWidth={"180px"}
      >
        <HStack>
          <Box
            border={` 2px solid ${color}`}
            padding="1px"
            borderRadius={"5px"}
          >
            <Image w={"30px"} h={"30px"} src={profilePhoto} />
          </Box>
          <VStack spacing={1} alignItems={"start"}>
            <Text fontSize={"13px"} color={color}>
              {name}
            </Text>
            <Text fontSize={"13px"} color={color} overflow={"hidden"}>
              {companyName}
            </Text>
            <Box position={"absolute"} right={"15px"} top={"28px"}>
              {isOpen ? (
                <ChevronUpIcon color={"white"} />
              ) : (
                <ChevronDownIcon color={"#87A3BC"} />
              )}
            </Box>
          </VStack>
        </HStack>
      </MenuButton>
      <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
        {itemsList.map((item, index) => (
          <MenuItem
            onClick={item.onClick ? item.onClick : () => {}}
            key={index}
          >
            <Link href={item.src}>{item.label}</Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
