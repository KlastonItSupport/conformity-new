import React from "react";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
} from "@chakra-ui/react";

export const AddressModal = ({
  isOpen,
  onClose,
  title,
  description,
  modalSize = "xl",
  addressInfo,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} trapFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhes do endereço</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems={"start"} w={"100%"}>
            <Text>{description}</Text>
            <Text>
              <Text fontWeight="bold">CEP:</Text> {addressInfo?.cep}
            </Text>
            <Text>
              <Text fontWeight="bold">Estado:</Text> {addressInfo?.state}
            </Text>
            <Text>
              <Text fontWeight="bold">Cidade:</Text> {addressInfo?.city}
            </Text>
            <Text>
              <Text fontWeight="bold">Bairro:</Text> {addressInfo?.neighborhood}
            </Text>
            <Text>
              <Text fontWeight="bold">Número:</Text> {addressInfo?.number}
            </Text>
            <Text>
              <Text fontWeight="bold">Complemento:</Text>{" "}
              {addressInfo.complement}
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
