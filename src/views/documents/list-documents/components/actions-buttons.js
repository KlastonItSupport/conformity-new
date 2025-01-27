import { HStack, VStack, useDisclosure } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import DocumentForm from "components/forms/documents/create-document/create-document";
import { useBreakpoint } from "hooks/usebreakpoint";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ActionsButtons = ({ canAdd }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [createDocumentIsLoading, setCreateDocumentIsLoading] = useState(false);

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const addButton = canAdd && (
    <ButtonPrimary
      fontSize="sm"
      fontWeight="bold"
      h="40px"
      bgColor={"header.100"}
      _hover={{ bgColor: "primary.200" }}
      textColor={"white"}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="7px"
      _active={{ bgColor: "primary.200" }}
      label={"Adicionar"}
      onClick={onAddModalOpen}
      width="150px"
    />
  );

  const listButton = (
    <ButtonPrimary
      fontSize="sm"
      fontWeight="bold"
      h="40px"
      bgColor={"header.100"}
      _hover={{ bgColor: "primary.200" }}
      textColor={"white"}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="7px"
      _active={{ bgColor: "primary.200" }}
      label={"Lista mestre"}
      width="150px"
    />
  );
  const revisivionButton = (
    <ButtonPrimary
      fontSize="sm"
      fontWeight="bold"
      h="40px"
      bgColor={"header.100"}
      _hover={{ bgColor: "primary.200" }}
      textColor={"white"}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="7px"
      _active={{ bgColor: "primary.200" }}
      label={"Revisões"}
      width="150px"
      onClick={() => navigate("/revisions")}
    />
  );

  const reminderButton = (
    <ButtonPrimary
      fontSize="sm"
      fontWeight="bold"
      h="40px"
      bgColor={"header.100"}
      _hover={{ bgColor: "primary.200" }}
      textColor={"white"}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="7px"
      _active={{ bgColor: "primary.200" }}
      label={"Lembretes"}
      width="150px"
      onClick={() => navigate("/reminders")}
    />
  );
  return (
    <>
      {isMobile ? (
        <VStack w={"100%"} mb={"30px !important"}>
          <HStack w={"100%"}  justifyContent={"space-between"}>
            {addButton}
            {listButton}
          </HStack>
          <HStack w={"100%"} justifyContent={"space-between"}>
            {revisivionButton}
            {reminderButton}
          </HStack>
        </VStack>
      ) : (
        <HStack justify={"start"} w={"100%"}>
          {addButton}
          {listButton}
          {revisivionButton}
          {reminderButton}
        </HStack>
      )}
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <DocumentForm
            formRef={formRef}
            onClose={onAddModalClose}
            setIsLoading={setCreateDocumentIsLoading}
          />
        }
        formRef={formRef}
        title={t("Adicionar Documento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="2xl"
        isLoading={createDocumentIsLoading}
      />
    </>
  );
};

export default ActionsButtons;
