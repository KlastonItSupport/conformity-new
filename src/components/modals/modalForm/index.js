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

const ModalForm = ({
  isOpen,
  onClose,
  id,
  form,
  formRef,
  title,
  description,
  leftButtonLabel,
  rightButtonLabel,
}) => {
  const handleEdit = () => {
    formRef.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems={"start"} w={"100%"}>
            <Text>{description}</Text>
            {form}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent={"center"} w={"100%"}>
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
              label={leftButtonLabel}
              onClick={onClose}
              width="150px"
              marginRight="20px"
            />
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
              type="submit"
              label={rightButtonLabel}
              onClick={handleEdit}
              width="150px"
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalForm;
