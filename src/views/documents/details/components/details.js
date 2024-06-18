import {
  Box,
  Container,
  HStack,
  Link,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BellRinging, Trash } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import { ExtrasDocuments } from "components/components";
import { DeleteModal } from "components/components";
import { DetailsDocumentsContext } from "providers/details-documents";
import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const DocumentsDetails = () => {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const { additionalDocuments, deleteAdditionalDocument } = useContext(
    DetailsDocumentsContext
  );
  const [deleteAdditionalDocumentId, setDeleteAdditionalDocumentId] =
    useState();

  const [createAdditionalIsLoading, setCreateAdditionalIsLoading] =
    useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const handleDeleteAdditionalDocument = async () => {
    setIsDeleteLoading(true);
    await deleteAdditionalDocument(deleteAdditionalDocumentId);
    setIsDeleteLoading(false);
    onDeleteModalClose();
  };

  const infoItem = (label, value, hasBorder = true) => {
    return (
      <HStack
        borderTop={hasBorder ? "1px solid #ddd" : null}
        justifyContent={"space-between"}
        w={"100%"}
        p={"10px"}
        marginTop={"0px !important"}
      >
        <Text fontWeight={"bold"} fontSize={"13px"}>
          {label}
        </Text>
        <Text fontSize={"13px"}>{value}</Text>
      </HStack>
    );
  };

  const docInfo = (label, hasBorder = true, href, id) => {
    return (
      <HStack
        borderTop={hasBorder ? "1px solid #ddd" : null}
        justifyContent={"space-between"}
        w={"100%"}
        p={"10px"}
        marginTop={"0px !important"}
      >
        <Link
          fontWeight={"bold"}
          cursor={"pointer"}
          color={"#0075df"}
          fontSize={"13px"}
          _hover={{ textDecoration: "underline" }}
          href={href}
          target="_blank"
        >
          {label}
        </Link>
        <HStack>
          <BellRinging
            size={16}
            weight="fill"
            color={"#0075df"}
            cursor={"pointer"}
          />
          <Trash
            size={16}
            color="#0086FF"
            weight="fill"
            cursor={"pointer"}
            onClick={() => {
              setDeleteAdditionalDocumentId(id);
              onDeleteModalOpen();
            }}
          />
        </HStack>
      </HStack>
    );
  };
  const header = (
    <>
      <HStack w={"100%"} justify={"space-between"} mb={"10px"}>
        <Text fontSize="20px" fontWeight={"500"} color={"header.100"}>
          Documento:
        </Text>
        <Text
          cursor={"pointer"}
          color={"#0075df"}
          _hover={{ textDecoration: "underline" }}
          onClick={onEditModalOpen}
        >
          Adicionar
        </Text>
      </HStack>
      <Container m={"0px"} p={"0"} border={"1px solid #ddd"}>
        {additionalDocuments.map((document, index) =>
          docInfo(document.name, index !== 0, document.link, document.id)
        )}
      </Container>
    </>
  );

  const info = (
    <>
      <Text fontSize="20px" fontWeight={"500"} color={"header.100"}>
        Informações:
      </Text>
      <Container m={"0px"} p={"0"} border={"1px solid #ddd"}>
        {infoItem("Autor:", "Gustavo", false)}
        {infoItem("Categoria:", "PROCEDIMENTOS")}
        {infoItem("DEPARTAMENTO:", "QUALIDADE")}
        {infoItem("DATA DE INCLUSÃO (Sistema):", "22/11/2023")}
        {infoItem("DATA DE REVISÃO (Documento):", "23/11/2023")}
        {infoItem("DATA DE CRIAÇÃO (Documento):", "23/11/2023")}
        {infoItem("VALIDADE:", "23/11/2023")}
        {infoItem("DATA DE ENVIO:", "23/11/2023")}
        {infoItem("EMPRESA:", "23/11/2023")}
      </Container>
    </>
  );

  return (
    <>
      <Box bgColor={"#FFFFFF"} p={"25px"} border={"1px solid #ddd"}>
        <VStack justify={"start"} align={"start"}>
          {header}
          {info}
        </VStack>
      </Box>
      <DeleteModal
        title={t("Excluir Documento")}
        subtitle={t("Tem certeza de que deseja excluir este Documento?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={() => handleDeleteAdditionalDocument()}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <ExtrasDocuments
            formRef={formRef}
            onClose={onEditModalClose}
            setIsLoading={setCreateAdditionalIsLoading}
          />
        }
        formRef={formRef}
        title={t("Adicionar Documentos")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
        isLoading={createAdditionalIsLoading}
      />
    </>
  );
};

export default DocumentsDetails;
