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
import { useTranslation } from "react-i18next";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  id,
  title,
  subtitle,
  isLoading = false,
}) => {
  const { t } = useTranslation();
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
            label={t("Excluir")}
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

export default DeleteModal;
