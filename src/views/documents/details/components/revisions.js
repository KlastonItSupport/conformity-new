import {
  Container,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import {
  RevisionsForm,
  ModalForm,
  DeleteModal,
  CustomTable,
} from "components/components";
import { AuthContext } from "providers/auth";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  addRevision,
  columns,
  deleteMultipleRevisions,
  deleteRevision,
  editRevision,
  getRevision,
} from "../helpers/revisions-helper";

const Revisions = () => {
  const { t } = useTranslation();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [edit, setEdit] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedIsLoading, setSelectedIsLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const documentId = queryParams.get("id");

  const [revisions, setRevisions] = useState([]);

  const formRef = useRef(null);
  const formRefAdd = useRef(null);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isMultipleDeleteModalOpen,
    onOpen: onMultipleDeleteModalOpen,
    onClose: onMultipleDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const onDeleteClick = (item) => {
    onDeleteModalOpen();
    setDeleteId(item.id);
  };

  const onEditClick = (item) => {
    onEditModalOpen();
    setEdit(item);
  };

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <NotePencil size={20} />,
      onClickRow: (e) => onEditClick(e),

      isDisabled: false,
      shouldShow: false,
    },
    {
      icon: <Trash size={20} />,
      onClickRow: (e) => onDeleteClick(e),
      onClickHeader: (selecteds) => {
        setSelectedItems(selecteds);
        onMultipleDeleteModalOpen();
      },
      isDisabled: false,
      shouldShow: true,
    },
  ]);

  useEffect(() => {
    getRevision(documentId, setRevisions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
            onClick={onAddModalOpen}
            width="100px"
            padding={"5px"}
            h="40px"
          />
        </HStack>
        <Container w={"100%"} maxW={"null"} p={"0px"} overflow={"hidden"}>
          <CustomTable
            data={revisions}
            columns={columns}
            title={t("Revisões")}
            actionButtons={[
              <NotePencil size={20} cursor={"pointer"} color="black" />,
              <Trash size={20} cursor={"pointer"} color="black" />,
            ]}
            icons={tableIcons}
            onCheckItems={(show) => {
              setTableIcons(
                tableIcons.map((icon) => {
                  icon.isDisabled = show;
                  return icon;
                })
              );
            }}
            onChangeSearchInput={(e) => {}}
            searchInputValue={() => {}}
            paddingOnTitle={false}
            showSearchInput={false}
            hasMinHg={false}
          />
        </Container>
      </VStack>
      <DeleteModal
        title={t("Excluir Revisão")}
        subtitle={t("Tem certeza de que deseja excluir esta Revisão?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteRevision(deleteId, revisions, setRevisions);
          setIsDeleteLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isDeleteLoading}
      />

      <DeleteModal
        title={t("Excluir Revisoes")}
        subtitle={t("Tem certeza de que deseja excluir estas Revisoes?")}
        isOpen={isMultipleDeleteModalOpen}
        onClose={onMultipleDeleteModalClose}
        onConfirm={async () => {
          setSelectedIsLoading(true);
          await deleteMultipleRevisions(
            selectedItems,
            revisions,
            setRevisions,
            onMultipleDeleteModalClose
          );
          setSelectedIsLoading(false);
        }}
        isLoading={selectedIsLoading}
      />

      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <RevisionsForm
            formRef={formRef}
            onClose={onEditModalClose}
            submitFunc={(data) =>
              editRevision(data, edit, revisions, setRevisions)
            }
            defaultValues={edit}
            setLoading={setIsEditLoading}
          />
        }
        formRef={formRef}
        title={t("Editar Revisão")}
        description={t("Tem certeza de que deseja Editar esta Revisão?")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isEditLoading}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        id={"editId"}
        form={
          <RevisionsForm
            formRef={formRefAdd}
            onClose={onAddModalClose}
            event={"add"}
            submitFunc={(data) =>
              addRevision(data, user.id, documentId, revisions, setRevisions)
            }
            setLoading={setIsAddLoading}
          />
        }
        formRef={formRefAdd}
        title={t("Adicionar Revisão")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
        isLoading={isAddLoading}
      />
    </>
  );
};

export default Revisions;
