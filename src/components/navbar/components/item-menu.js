import {
  useDisclosure,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  HStack,
  Link,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import React from "react";
import { sleep } from "helpers/sleep";

export function ItemMenu({ icon, itemsList, label }) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  return isDesktop ? (
    <Menu isOpen={isOpen}>
      <MenuButton
        variant="ghost"
        mx={1}
        borderRadius={5}
        fontWeight="normal"
        onMouseEnter={onOpen}
        onMouseLeave={async () => {
          await sleep(700);
          onClose();
        }}
      >
        <HStack>
          {label ? (
            <Text color={"white"}>{label}</Text>
          ) : (
            React.cloneElement(icon, {
              color: isOpen ? "white" : "#87A3BC",
            })
          )}
          {isOpen ? (
            <ChevronUpIcon color={"white"} />
          ) : (
            <ChevronDownIcon color={"#87A3BC"} />
          )}
        </HStack>
      </MenuButton>
      <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
        {itemsList.map((item, index) => (
          <MenuItem key={index}>
            <Link href={item.src}>{item.label}</Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  ) : (
    <VStack alignItems={"start"}>
      <HStack onClick={onToggle}>
        {icon ? (
          React.cloneElement(icon, {
            size: 32,
            color: isOpen ? "white" : "#87A3BC",
          })
        ) : (
          <Text color={"white"}>{label}</Text>
        )}
        {isOpen ? (
          <ChevronUpIcon color={"white"} />
        ) : (
          <ChevronDownIcon color={"#87A3BC"} />
        )}
      </HStack>
      {isOpen &&
        itemsList.map((item, index) => (
          <Link
            key={index + item.label}
            color={"white"}
            href={item.src}
            pl={"10px"}
          >
            {item.label}
          </Link>
        ))}
    </VStack>
  );
}
