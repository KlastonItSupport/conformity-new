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
  useDisclosure,
} from "@chakra-ui/react";
import { DownloadSimple } from "@phosphor-icons/react";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { api } from "api/api";
import { ButtonPrimary } from "components/button-primary";
import { AuthContext } from "providers/auth";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FileForm from "../forms/files-form";
import { ModalForm } from "components/components";
import { toast } from "react-toastify";
import { DeleteModal } from "components/components";
import { AUDIT_EVENTS } from "constants/audit-events";

const ActionDocumentModal = ({ isOpen, onClose, id, canAdd, canDelete }) => {
  const { getToken } = useContext(AuthContext);
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const formRef = useRef(null);

  const getDocuments = async () => {
    const response = await api.get(`equipments/actions/documents/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setDocuments(response.data);
  };

  const deleteDocument = async (id) => {
    const response = await api.delete(`equipments/actions/documents/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_DOCUMENTS_DELETED,
      },
    });

    if (response.status === 200) {
      setDocuments(documents.filter((document) => document.id !== id));
      toast.success("Documento removido com sucesso");
    }
  };

  const createDocumentAction = async (data) => {
    const response = await api.post(
      `equipments/actions/documents/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.EQUIPMENTS_DOCUMENTS_ADD,
        },
      }
    );

    if (response.status === 201) {
      toast.success("Documento adicionado com sucesso");
      setDocuments([...response.data, ...documents]);
      onAddModalClose();
    }
  };

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      getDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Documentos da ação ")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack w={"100%"} justify={"start"}>
              <ButtonPrimary
                fontSize="sm"
                fontWeight="bold"
                mb="24px"
                bgColor={"primary.100"}
                _hover={{ bgColor: "primary.200" }}
                textColor={"white"}
                boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
                borderRadius="7px"
                _active={{ bgColor: "primary.200" }}
                label={"Adicionar novo Documento"}
                padding={"15px"}
                h="40px"
                type="submit"
                onClick={onAddModalOpen}
                // isLoading={isLoading}
                disabled={!canAdd}
              />
            </HStack>

            {documents.map((document, index) => {
              return (
                <HStack
                  key={index}
                  justify={"space-between"}
                  cursor={"pointer"}
                  py={"5px"}
                >
                  <Text
                    color={"primary.100"}
                    onClick={() => window.open(document.link)}
                    maxW={"70%"}
                    isTruncated
                  >
                    {document.name}
                  </Text>
                  <HStack>
                    <DownloadSimple
                      size={20}
                      onClick={() => window.open(document.link)}
                    />
                    <Trash
                      size={20}
                      disabled={!canDelete}
                      onClick={() => {
                        if (canDelete) {
                          setDeleteId(document.id);
                          onDeleteModalOpen();
                        }
                      }}
                      cursor={canDelete ? "pointer" : "not-allowed"}
                    />
                  </HStack>
                </HStack>
              );
            })}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <FileForm
            formRef={formRef}
            onClose={onAddModalClose}
            onOpen={onAddModalOpen}
            onSubmitForm={createDocumentAction}
            setIsLoading={setIsLoading}
            id={id}
          />
        }
        formRef={formRef}
        title={t("Adicionar Ação")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />

      <DeleteModal
        title={t("Excluir Documento")}
        subtitle={t("Tem certeza de que deseja excluir este Documento?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);
          await deleteDocument(deleteId);

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default ActionDocumentModal;
