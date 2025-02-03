import {
  useDisclosure,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Link,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const ItemMenu = ({ icon, itemsList, label }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        variant="ghost"
        mx={1}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        _hover={{ bg: 'transparent' }}
      >
        {label ? (
          <Text color="white" _hover={{ color: "#87A3BC" }}>
            {label}
          </Text>
        ) : (
          React.cloneElement(icon, {
            color: isOpen ? "#87A3BC" : "white",
          })
        )}
      </MenuButton>
      <MenuList
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        bg="#1E2A35"
        borderColor="rgba(134, 162, 187, 0.1)"
        borderRadius="xl"
        p={1}
      >
        {itemsList.map((item, index) => (
          <MenuItem
            key={index}
            _hover={{
              bg: '#2B3D4C',
              color: 'white',
            }}
            color="#87A3BC"
          >
            <Link href={item.src}>{item.label}</Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};