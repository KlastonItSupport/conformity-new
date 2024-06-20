import {
  Container,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { MagnifyingGlass, Trash } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import { RelatedDocsForm } from "components/components";
import { DeleteModal } from "components/components";
import { CustomTable } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  columns,
  createRelatedDocument,
  deleteMultiple,
  deleteRelatedDocument,
  getCompanyDocuments,
  getRelatedDocuments,
} from "../helpers/related-documents-helper";
import { AuthContext } from "providers/auth";

const RelatedDocuments = ({ documentId }) => {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const [selecteds, setSelecteds] = useState([]);
  const [deleted, setDeleted] = useState(null);

  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const { getToken } = useContext(AuthContext);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteMultipleModalOpen,
    onOpen: onDeleteMultipleModalOpen,
    onClose: onDeleteMultipleModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <Trash size={20} />,
      onClickRow: (e) => onDeleteClick(e),
      onClickHeader: (selecteds) => {
        setSelecteds(selecteds);
        onDeleteMultipleModalOpen();
      },
      isDisabled: false,
      shouldShow: true,
    },
    {
      icon: <MagnifyingGlass size={20} />,
      onClickRow: (item) =>
        window.open(`/documents/details?id=${item.id}`, "_blank"),
      onClickHeader: (selecteds) => {},
      isDisabled: false,
      shouldShow: false,
    },
  ]);

  const onDeleteClick = (item) => {
    onDeleteModalOpen();
    setDeleted(item.id);
  };

  useEffect(() => {
    getRelatedDocuments(setRelatedDocuments, documentId);
    getCompanyDocuments(setCompanyDocuments, documentId, getToken());
  }, []);

  useEffect(() => {
    console.log("relatedDocuments", relatedDocuments);
  }, [relatedDocuments]);

  useEffect(() => {
    console.log("selecteds", selecteds);
  }, [selecteds]);

  return (
    <VStack
      bgColor={"#FFFFFF"}
      marginInlineStart={0}
      p={"25px"}
      border={"1px solid #ddd"}
      alignItems={"start"}
      mt={"20px"}
    >
      <HStack
        justifyContent={"space-between"}
        w={"100%"}
        color={"#0075df"}
        cursor={"pointer"}
      >
        <Text fontSize={"20px"} color={"header.100"}></Text>
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
          type="submit"
          label={"Adicionar"}
          onClick={onEditModalOpen}
          width="100px"
          padding={"5px"}
          h="40px"
        />
      </HStack>
      <Container w={"100%"} maxW={"null"} p={"0px"}>
        <CustomTable
          data={relatedDocuments}
          deskWidth={"100%"}
          columns={columns}
          title={t("Documentos Relacionados")}
          actionButtons={[<Trash size={20} cursor={"pointer"} color="black" />]}
          icons={tableIcons}
          onChangeSearchInput={(e) => {}}
          searchInputValue={() => {}}
          onCheckItems={(show) => {
            setTableIcons(
              tableIcons.map((icon) => {
                icon.isDisabled = show;
                return icon;
              })
            );
          }}
          paddingOnTitle={false}
          showSearchInput={false}
          hasMinHg={false}
        />
        <DeleteModal
          title={t("Excluir Documento Relacionado")}
          subtitle={t(
            "Tem certeza de que deseja excluir este documento relacionado?"
          )}
          isOpen={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          onConfirm={async () => {
            setIsDeleteLoading(true);
            await deleteRelatedDocument(
              deleted,
              setRelatedDocuments,
              relatedDocuments
            );
            setIsDeleteLoading(false);
            onDeleteModalClose();
          }}
          isLoading={isDeleteLoading}
        />
        <DeleteModal
          title={t("Excluir Documentos Relacionados")}
          subtitle={t(
            "Tem certeza de que deseja excluir estes documentos relacionados?"
          )}
          isOpen={isDeleteMultipleModalOpen}
          onClose={onDeleteMultipleModalClose}
          onConfirm={async () => {
            setIsDeleteLoading(true);
            await deleteMultiple(
              selecteds,
              setRelatedDocuments,
              relatedDocuments
            );
            setIsDeleteLoading(false);
            onDeleteMultipleModalClose();
          }}
          isLoading={isDeleteLoading}
        />
        <ModalForm
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          form={
            <RelatedDocsForm
              formRef={formRef}
              onClose={onEditModalClose}
              options={companyDocuments}
              onConfirm={async (data) =>
                await createRelatedDocument(
                  documentId,
                  data.documentSideId,
                  setRelatedDocuments,
                  relatedDocuments
                )
              }
              setLoading={setIsCreateLoading}
            />
          }
          formRef={formRef}
          title={t("Adicionar Documento")}
          leftButtonLabel={t("Cancelar")}
          rightButtonLabel={t("Adicionar")}
          modalSize="xl"
          isLoading={isCreateLoading}
        />
      </Container>
    </VStack>
  );
};

export default RelatedDocuments;
