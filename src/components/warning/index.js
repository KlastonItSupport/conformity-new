import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import React from "react";
import ReactHtmlParser from "react-html-parser";

const WarningModal = ({ isOpen, onClose, onConfirm, warning }) => {
  return (
    <Modal isOpen={isOpen} onClose={async () => onClose()} rapFocus={false}>
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
              label={"Entendi e gostaria de não ver este aviso"}
              onClick={async () => await onConfirm(warning.id)}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WarningModal;
