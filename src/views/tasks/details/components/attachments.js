import { HStack, Link, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { Trash } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import React, { useRef } from "react";
import AttachmentForm from "./attachment-form";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "components/components";

const Attachments = ({ attachments }) => {
  const { t } = useTranslation();
  const attachmentFormRef = useRef();

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

  const docInfo = (label, hasBorder = true, href, id, borderBottom = false) => {
    return (
      <HStack
        borderTop={hasBorder ? "1px solid #ddd" : null}
        // border={"1px solid #ddd"}
        borderBottom={borderBottom ? "1px solid #ddd" : null}
        justifyContent={"space-between"}
        w={"100%"}
        p={"10px"}
        marginTop={"0px !important"}
      >
        <Link
          fontWeight={"bold"}
          cursor={"pointer"}
          color={"#0075df"}
          fontSize={"15px"}
          _hover={{ textDecoration: "underline" }}
          href={href}
          target="_blank"
        >
          {label}
        </Link>
        <HStack>
          <Trash
            size={24}
            color="#0086FF"
            weight="fill"
            cursor={"pointer"}
            onClick={() => onDeleteModalOpen()}
          />
        </HStack>
      </HStack>
    );
  };
  return (
    <>
      <VStack
        align="start"
        bgColor={"white"}
        border={"1px solid #ddd"}
        p={"20px"}
        mt={"20px"}
      >
        <HStack w={"100%"} justifyContent={"space-between"}>
          <Text fontSize={"20px"} color={"header.100"}>
            Anexos:
          </Text>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Adicionar Anexo"}
            padding={"15px"}
            h="40px"
            type="submit"
            onClick={onAddModalOpen}
            margin="0 0 10px 0 !important"
          />
        </HStack>
        {attachments.length > 0 ? (
          attachments.map((document, index) => {
            const isFirst = index === 0;
            const isLast = index === attachments.length - 1;

            return docInfo(
              document.name,
              isFirst ? true : index !== 0,
              document.link,
              document.id,
              isLast
            );
          })
        ) : (
          <Text>Ainda não há documentos adicionados</Text>
        )}
      </VStack>
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <AttachmentForm formRef={attachmentFormRef} onClose={(type) => {}} />
        }
        formRef={attachmentFormRef}
        title={t("Adicionar Anexo")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        // isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Anexo")}
        subtitle={t("Tem certeza de que deseja excluir anexo da sua tarefa?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {}}
        // isLoading={isDeleteLoading}
      />
    </>
  );
};

export default Attachments;
