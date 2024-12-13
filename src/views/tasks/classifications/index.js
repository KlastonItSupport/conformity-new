import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import { NotePencil, Trash } from "@phosphor-icons/react";
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

import { ModalForm } from "components/components";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import { ButtonPrimary } from "components/button-primary";
import { TasksContext } from "providers/tasks";
import TaskClassification from "components/forms/task-classification/task-classification";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { compose } from "recompose";
import { AUDIT_EVENTS } from "constants/audit-events";
import Wrapper from "components/wrapper";

const ClassificationPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [classifications, setClassifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const {
    deleteMultipleClassifications,
    deleteClassification,
    getClassifications,
  } = useContext(TasksContext);

  const {
    userPermissions,
    userAccessRule,
    checkPermissionForAction,
    dispatchAuditEvent,
  } = useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/tasks/classifications",
      label: "Classificações",
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
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.TASKS_CLASSIFICATIONS_LIST);
    getClassifications(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? ""
    ).then((res) => {
      setClassifications(res.items);
      setPagination(res.pages);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateIcons = () => {
      const deleteIcon = checkPermissionForAction("tasks", "canDelete")
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

      const editIcon = checkPermissionForAction("tasks", "canEdit")
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

      const icons = [deleteIcon, editIcon].filter((icon) => icon !== null);

      setTableIcons(icons);
    };

    updateIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, userAccessRule]); // Atualiza os ícones quando userPermissions muda

  const [tableIcons, setTableIcons] = useState([]);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    const res = await getClassifications(page, queryParams.get("search") ?? "");
    setPagination(res.pages);
    setClassifications(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getClassifications(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? ""
      );

      setPagination(res.pages);
      setClassifications(res.items);
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
          data={classifications ?? []}
          columns={columns}
          title={t("Classificações")}
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
          {pagination && (
            <Pagination
              data={classifications}
              onClickPagination={updateData}
              itemsPerPage={5}
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              nextPage={pagination.next}
              lastPage={pagination.last}
            />
          )}
        </Flex>
      </VStack>
      <DeleteModal
        title={t("Excluir Classificação")}
        subtitle={t("Tem certeza de que deseja excluir esta Classificação?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteClassification(deleteId);
          if (response) {
            setClassifications(
              classifications.filter(
                (classification) => classification.id !== deleteId
              )
            );
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Classificações")}
        subtitle={t("Tem certeza de que deseja excluir estas Classificações?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleClassifications(
            selected,
            setClassifications,
            classifications
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
          <TaskClassification
            formRef={categoryRef}
            onClose={(origin) => {
              onEditModalClose();
              const originsCopy = [...classifications];
              const index = originsCopy.findIndex(
                (item) => item.id === origin.id
              );
              originsCopy[index] = origin;
              setClassifications(originsCopy);
            }}
            event="edit"
            id={editSelected.id}
            formValues={editSelected}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Editar Classificação")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="md"
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <TaskClassification
            formRef={categoryRef}
            onClose={(origin) => {
              onAddModalClose();
              setClassifications([origin, ...classifications]);
            }}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Adicionar Classificação")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="md"
        isLoading={isLoading}
      />
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("tasks"),
  withWarningCheck
)(ClassificationPage);
