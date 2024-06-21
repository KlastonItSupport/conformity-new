import { HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { NotePencil } from "@phosphor-icons/react";
import { DocumentDescriptionForm } from "components/components";
import { ModalForm } from "components/components";
import React, { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import HtmlParser from "react-html-parser";
import { DetailsDocumentsContext } from "providers/details-documents";

const Description = () => {
  const formRef = useRef(null);
  const { t } = useTranslation();
  const [isEditLoading, setIsEditLoading] = useState(false);
  const { description } = useContext(DetailsDocumentsContext);

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  return (
    <VStack
      bgColor={"#FFFFFF"}
      marginInlineStart={0}
      margin={0}
      p={"25px"}
      border={"1px solid #ddd"}
      alignItems={"start"}
    >
      <HStack justifyContent={"space-between"} w={"100%"} color={"#0075df"}>
        <Text fontSize={"20px"} color={"header.100"}>
          DESCRIÇÃO DO DOCUMENTO
        </Text>
        <NotePencil cursor={"pointer"} size={20} onClick={onEditModalOpen} />
      </HStack>
      <Text>{HtmlParser(description)}</Text>
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        id={"editId"}
        form={
          <DocumentDescriptionForm
            formRef={formRef}
            onClose={onEditModalClose}
          />
        }
        formRef={formRef}
        title={t("Editar Descrição")}
        description={t("Tem certeza de que deseja Editar esta Descrição?")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isEditLoading}
      />
    </VStack>
  );
};

export default Description;
