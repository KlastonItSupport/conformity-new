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
        borderRadius="md"
        fontWeight="normal"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        minWidth="200px"
        _hover={{
          bg: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <HStack spacing={3}>
          <Box
            border={`2px solid ${color}`}
            padding="1px"
            borderRadius="md"
            overflow="hidden"
          >
            <Image 
              w="32px" 
              h="32px" 
              src={profilePhoto}
              objectFit="cover"
              borderRadius="sm"
            />
          </Box>
          <VStack spacing={0} alignItems="start">
            <Text fontSize="sm" color={color} fontWeight="medium">
              {name}
            </Text>
            <Text 
              fontSize="xs" 
              color={color} 
              maxW="120px" 
              isTruncated
            >
              {companyName}
            </Text>
          </VStack>
          <Box ml="auto">
            {isOpen ? (
              <ChevronUpIcon color="white" />
            ) : (
              <ChevronDownIcon color="#87A3BC" />
            )}
          </Box>
        </HStack>
      </MenuButton>
      <MenuList
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        bg="#1E2A35"
        borderColor="rgba(134, 162, 187, 0.1)"
        borderRadius="xl"
        p={1}
        minW="220px"
        boxShadow="lg"
      >
        {itemsList.map((item, index) => (
          <MenuItem
            key={index}
            onClick={item.onClick}
            _hover={{
              bg: '#2B3D4C',
              color: 'white',
            }}
            _focus={{
              bg: '#2B3D4C',
              color: 'white',
            }}
            color="#87A3BC"
            borderRadius="md"
            fontSize="sm"
            px={4}
            py={2}
            transition="all 0.2s"
          >
            <Link 
              href={item.src} 
              _hover={{ textDecoration: 'none' }}
              w="100%"
            >
              {item.label}
            </Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};