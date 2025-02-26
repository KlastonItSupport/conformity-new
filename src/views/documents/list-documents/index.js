import { CustomTable } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns, mockedData } from "./table-helper";
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  NotePencil,
  Trash,
} from "@phosphor-icons/react";
import { NavBar } from "components/navbar";
import { Flex, VStack, useBreakpoint, useDisclosure, Box, Spinner, Text } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";
import Filters from "./components/filters";
import ActionsButtons from "./components/actions-buttons";
import { DeleteModal } from "components/components";

import { ModalForm } from "components/components";
import DocumentForm from "components/forms/documents/create-document/create-document";
import { DocumentContext } from "providers/document";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { AUDIT_EVENTS } from "constants/audit-events";
import Wrapper from "components/wrapper";
import { TopNavigation } from "components/top-navigation";
import { useSidebar } from 'contexts/SidebarContext';

const ListDocumentsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const history = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    documents,
    setDocuments,
    getDocuments,
    deleteDocument,
    deleteId,
    setDeleteId,
    editSelected,
    setEditSelected,
    pagination,
  } = useContext(DocumentContext);
  const {
    userPermissions,
    userAccessRule,
    checkPermissionForAction,
    dispatchAuditEvent,
    user,
    getUserInfo,
    setUser,
  } = useContext(AuthContext);

  const formRef = useRef(null);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/documents",
      label: "Documentos",
      isCurrent: true,
    },
  ];

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

  const { isCollapsed } = useSidebar();

  useEffect(() => {
    const initializeUser = async () => {
      if (!user || !user.id) {
        const userInfo = getUserInfo();
        setUser(userInfo);
      }
      setIsLoading(false);
    };

    initializeUser();
  }, [user, getUserInfo, setUser]);

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.DOCUMENTS_GET);
    getDocuments(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      handlingSearchParams()
    ).then((data) => setDocuments(data.items));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateIcons = () => {
      const deleteIcon = checkPermissionForAction("documents", "canDelete")
        ? {
            icon: <Trash size={20} />,
            onClickRow: (item) => {
              setDeleteId(item.id);
              onDeleteModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: true,
          }
        : null;

      const searchIcon = checkPermissionForAction("documents", "canRead")
        ? {
            icon: <MagnifyingGlass size={20} />,
            onClickRow: (item) => history(`/documents/details?id=${item.id}`),
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            notShow: true,
          }
        : null;

      const editIcon = checkPermissionForAction("documents", "canEdit")
        ? {
            icon: <NotePencil size={20} />,
            onClickRow: (item) => {
              setEditSelected(item);
              onEditModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
          }
        : null;

      const remindersIcon = checkPermissionForAction("documents", "canRead")
        ? {
            icon: <ClockCounterClockwise size={20} />,
            onClickRow: (item) =>
              history(`/documents/reminders?id=${item.id}&name=${item.name}`),
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
          }
        : null;

      const icons = [searchIcon, deleteIcon, editIcon, remindersIcon].filter(
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
    const documents = await getDocuments(page, queryParams.get("search"), {
      initialDate: queryParams.get("initialDate"),
      finalDate: queryParams.get("finalDate"),
      departamentId: queryParams.get("departamentId"),
      category: queryParams.get("category"),
    });

    setDocuments(documents.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const documents = await getDocuments(1, inputValue);

      setDocuments(documents.items);
    }
  }, 500);

  const handlingSearchParams = () => {
    const params = {};

    if (searchParams.get("initialDate")) {
      params.initialDate = searchParams.get("initialDate");
    }
    if (searchParams.get("finalDate")) {
      params.finalDate = searchParams.get("finalDate");
    }
    if (searchParams.get("departamentId")) {
      params.departamentId = searchParams.get("departamentId");
    }
    if (searchParams.get("categoryId")) {
      params.categoryId = searchParams.get("categoryId");
    }
    if (searchParams.get("projectId")) {
      params.projectId = searchParams.get("projectId");
    }

    return params;
  };

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Documentos cadastrados")}
      />
      <Box
        marginTop="64px"
        w="100%"
        pr={4}
      >
        <VStack 
          spacing={3}
          w="100%"
          align="stretch"
        >
          <Box>
            <NavigationLinks routeTree={routeTreePaths} />
          </Box>

          <Box>
            <Filters />
          </Box>
          
          {isLoading ? (
            <Box 
              w="100%" 
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              p={4}
              textAlign="center"
            >
              <Spinner />
              <Text mt={2}>{t("Carregando...")}</Text>
            </Box>
          ) : (
            <Box 
              w="100%" 
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              overflow="hidden"
            >
              <CustomTable
                data={documents}
                columns={columns}
                title={t("")}
                icons={tableIcons}
                actionsButtons={
                  <ActionsButtons 
                    canAdd={checkPermissionForAction("documents", "canAdd")} 
                  />
                }
                actionsButtonsPosition="right"
                onCheckItems={(show) => {
                  setTableIcons(
                    tableIcons.map((icon) => {
                      icon.isDisabled = show;
                      return icon;
                    })
                  );
                }}
                onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
                searchInputValue={searchParams.get("search") ?? ""}
                hasMinHg={false}
                border="none"
                borderRadius="lg"
              />
              {pagination && (
                <Box 
                  p={4} 
                  borderTop="1px solid" 
                  borderColor="gray.100"
                >
                  <Pagination
                    data={mockedData}
                    onClickPagination={updateData}
                    itemsPerPage={5}
                    totalPages={pagination.totalPages}
                    currentPage={pagination.currentPage}
                    nextPage={pagination.next}
                    lastPage={pagination.last}
                  />
                </Box>
              )}
            </Box>
          )}
        </VStack>
      </Box>
      <DeleteModal
        title={t("Excluir Documento")}
        subtitle={t("Tem certeza de que deseja excluir este Documento?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);

          const response = await deleteDocument(deleteId);
          if (response) {
            setDocuments(
              documents.filter((document) => document.id !== deleteId)
            );
          }

          setIsDeleteLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <DocumentForm
            formRef={formRef}
            onClose={onEditModalClose}
            formValues={editSelected}
            event="edit"
            setIsLoading={setIsEditLoading}
          />
        }
        formRef={formRef}
        title={t("Editar Documento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
        isLoading={isEditLoading}
      />
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("documents"),
  withWarningCheck
)(ListDocumentsPage);
