import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import { Folder, NotePencil, Trash } from "@phosphor-icons/react";
import { NavBar } from "components/navbar";
import {
  Flex,
  HStack,
  VStack,
  useBreakpoint,
  useDisclosure,
} from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";
import { DeleteModal } from "components/components";

import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import ActionForm from "../forms/actions-form";
import { EquipmentContext } from "providers/equipments";
import ActionDocumentModal from "../components/documents-modal";
import withAuthenticated from "hoc/with-authenticated";
import { compose } from "recompose";
import withWarningCheck from "hoc/with-warning-check";
import Wrapper from "components/wrapper";

const ActionsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const [editId, setEditId] = useState(false);
  const [documentActionId, setDocumentActionId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const canAdd = checkPermissionForAction("equipments", "canAdd");
  const canDelete = checkPermissionForAction("equipments", "canDelete");
  const canEdit = checkPermissionForAction("equipments", "canEdit");

  const {
    getActions,
    deleteActions,
    actions,
    createActions,
    updateActions,
    paginationActions,
    deleteMultipleActions,
  } = useContext(EquipmentContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/equipments",
      label: "Equipamentos",
      isCurrent: false,
    },
    {
      path: "/equipments/actions",
      label: "Ações",
      isCurrent: true,
    },
  ];

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
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isDocumentModalOpen,
    onOpen: onDocumentModalOpen,
    onClose: onDocumentModalClose,
  } = useDisclosure();

  useEffect(() => {
    getActions(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      10,
      id
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateIcons = () => {
      const fileIcon = true
        ? {
            icon: <Folder size={20} />,
            onClickRow: (item) => {
              setDocumentActionId(item.id);
              onDocumentModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Verificar documentos",
          }
        : null;
      const deleteIcon = checkPermissionForAction("equipments", "canDelete")
        ? {
            icon: <Trash size={20} />,
            onClickRow: (item) => {
              setDeleteId(item.id);
              onDeleteModalOpen();
            },
            onClickHeader: (selecteds) => {
              setSelected(selecteds);
              onDeleteMultipleModalOpen();
            },
            isDisabled: false,
            shouldShow: true,
          }
        : null;

      const editIcon = checkPermissionForAction("equipments", "canEdit")
        ? {
            icon: <NotePencil size={20} />,
            onClickRow: (item) => {
              setEditId(item);
              onEditModalOpen();
            },
            onClickHeader: (selecteds) => {
              // setSelected(selecteds);
              // onEditMultipleModalOpen();
            },
            isDisabled: false,
            shouldShow: false,
          }
        : null;

      const icons = [fileIcon, editIcon, deleteIcon].filter(
        (icon) => icon !== null
      );

      setTableIcons(icons);
    };

    updateIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, userAccessRule]); // Atualiza os ícones quando userPermissions muda

  const [tableIcons, setTableIcons] = useState([]);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    await getActions(page, queryParams.get("search") ?? "", 10, id);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      await getActions(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        10,
        id
      );
    }
  }, 500);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <HStack justify={"start"} w={"100%"} pb={"10px"}>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="40px"
            bgColor={"header.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Adicionar"}
            onClick={onAddModalOpen}
            width="150px"
            disabled={!checkPermissionForAction("tasks", "canAdd")}
          />
        </HStack>

        <CustomTable
          data={actions}
          columns={columns}
          title={t(`Ações do equipamento: ${name}`)}
          icons={tableIcons}
          searchInputValue={searchParams.get("search") ?? ""}
          onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
          iconsHasMaxW={true}
          onCheckItems={(show) => {
            setTableIcons(
              tableIcons.map((icon) => {
                icon.isDisabled = show;
                return icon;
              })
            );
          }}
        />
        <Flex
          justifyContent={"end"}
          w={isMobile ? "99vw" : "95vw"}
          bgColor={"white"}
        >
          {paginationActions && (
            <Pagination
              data={actions}
              onClickPagination={updateData}
              itemsPerPage={5}
              totalPages={paginationActions.totalPages}
              currentPage={paginationActions.currentPage}
              nextPage={paginationActions.next}
              lastPage={paginationActions.last}
            />
          )}
        </Flex>
      </VStack>
      <DeleteModal
        title={t("Excluir Documento")}
        subtitle={t("Tem certeza de que deseja excluir este Documento?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          await deleteActions(deleteId);

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Equipamentos")}
        subtitle={t("Tem certeza de que deseja excluir estas Equipamentos?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleActions(selected);
          setIsDeleteLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />

      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <ActionForm
            formRef={formRef}
            onClose={onAddModalClose}
            setLoading={setIsLoading}
            onAdd={createActions}
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
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <ActionForm
            formRef={formRef}
            onClose={onEditModalClose}
            setLoading={setIsLoading}
            onEdit={updateActions}
            id={id}
            formValues={editId}
            event="edit"
          />
        }
        formRef={formRef}
        title={t("Editar Ação")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />
      <ActionDocumentModal
        isOpen={isDocumentModalOpen}
        onClose={onDocumentModalClose}
        id={documentActionId}
        canAdd={canAdd}
        canDelete={canDelete}
      />
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("equipments"),
  withWarningCheck
)(ActionsPage);
