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
import { ButtonPrimary } from "components/button-primary";
import React from "react";
import ReactHtmlParser from "react-html-parser";

const WarningModal = ({ isOpen, onClose, warning }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={async () => await onClose(warning.id)}
      rapFocus={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Importante</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems={"start"} w={"100%"}>
            {ReactHtmlParser(warning?.warningMessage)}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={"center"} w={"100%"}>
            <ButtonPrimary
              fontSize="sm"
              fontWeight="bold"
              h="50"
              bgColor={"primary.100"}
              _hover={{ bgColor: "primary.200" }}
              textColor={"white"}
              boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
              borderRadius="7px"
              _active={{ bgColor: "primary.200" }}
              label={"Ok"}
              onClick={async () => await onClose(warning.id)}
              width="150px"
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WarningModal;
