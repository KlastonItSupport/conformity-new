import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import React from "react";

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  isLoading = false,
  alertLabel = "Confirmar",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{subtitle}</ModalBody>
        <ModalFooter>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="50"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "red.800" }}
            type="submit"
            label={alertLabel}
            onClick={onConfirm}
            width="150px"
            margin={"0 auto"}
            isLoading={isLoading}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
