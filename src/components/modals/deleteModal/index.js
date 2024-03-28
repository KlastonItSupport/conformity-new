import {
  Button,
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

const DeleteModal = ({ isOpen, onClose, id, title, subtitle }) => {
  const handleDelete = () => {
    console.log("IDDDDD", id);
    onClose(); // Fechar o modal após a exclusão
  };

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
            bgColor={"red.600"}
            _hover={{ bgColor: "red.800" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "red.800" }}
            type="submit"
            label="Excluir"
            onClick={onClose}
            width="150px"
            margin={"0 auto"}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
