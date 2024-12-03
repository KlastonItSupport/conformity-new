import { CustomTable } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import {
  ChatCircle,
  FilePdf,
  MagnifyingGlass,
  NotePencil,
  Trash,
} from "@phosphor-icons/react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import Filters from "./components/filters";
import { ButtonPrimary } from "components/button-primary";
import TaskForm from "components/forms/tasks/task-form";
import { TasksContext } from "providers/tasks";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { AUDIT_EVENTS } from "constants/audit-events";

const ListTasksPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const history = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editSelected, setEditSelected] = useState(null);
  const [selecteds, setSelecteds] = useState([]);

  const {
    userPermissions,
    userAccessRule,
    checkPermissionForAction,
    dispatchAuditEvent,
  } = useContext(AuthContext);

  const {
    getTasks,
    tasks,
    setTasks,
    pagination,
    deleteTask,
    deleteMultipleTasks,
    origins,
    setOrigins,
    classifications,
    setClassifications,
    types,
    setTypes,
    departaments,
    setDepartaments,
  } = useContext(TasksContext);

  const formRef = useRef(null);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/tasks",
      label: "Tasks",
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
    dispatchAuditEvent(AUDIT_EVENTS.TASKS_LIST);
    getTasks(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      handlingSearchParams()
    ).then((data) => setTasks(data.items));

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
              setSelecteds(selecteds);
              onDeleteMultipleModalOpen();
            },
            isDisabled: false,
            shouldShow: true,
          }
        : null;

      const searchIcon = checkPermissionForAction("tasks", "canRead")
        ? {
            icon: <MagnifyingGlass size={20} />,
            onClickRow: (item) => history(`/tasks/details?id=${item.id}`),
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            notShow: true,
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

      const seeTaskResumeIcon = {
        icon: <ChatCircle size={20} />,
        onClickRow: (item) => {},
        onClickHeader: () => {},
        isDisabled: false,
        shouldShow: false,
      };

      const printOut = {
        icon: <FilePdf size={20} />,
        onClickRow: (item) => {},
        onClickHeader: () => {},
        isDisabled: false,
        shouldShow: false,
      };
      const icons = [
        searchIcon,
        deleteIcon,
        editIcon,
        seeTaskResumeIcon,
        printOut,
      ].filter((icon) => icon !== null);

      setTableIcons(icons);
    };

    updateIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, userAccessRule]); // Atualiza os ícones quando userPermissions muda

  const [tableIcons, setTableIcons] = useState([]);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    const tasks = await getTasks(page, queryParams.get("search"));

    setTasks(tasks.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const documents = await getTasks(1, inputValue);

      setTasks(documents.items);
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
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <HStack justify={{ sm: "center", md: "start" }} w={"95vw"} py={"20px"}>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="50"
            bgColor={"primary.100"}
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
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="50"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Detalhamento"}
            width="150px"
            disabled={!checkPermissionForAction("tasks", "canAdd")}
          />
        </HStack>
        <Filters
          origins={origins}
          classifications={classifications}
          types={types}
          departaments={departaments}
          setOrigins={setOrigins}
          setClassifications={setClassifications}
          setTypes={setTypes}
          setDepartaments={setDepartaments}
        />
        <CustomTable
          data={tasks}
          columns={columns}
          title={t("Tasks")}
          icons={tableIcons}
          searchInputValue={searchParams.get("search") ?? ""}
          onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
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
              data={tasks}
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
        title={t("Excluir Tarefa")}
        subtitle={t("Tem certeza de que deseja excluir esta Tarefa?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteTask(deleteId);
          if (response) {
            setTasks(tasks.filter((document) => document.id !== deleteId));
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Tarefas")}
        subtitle={t("Tem certeza de que deseja excluir estas Tarefas?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          await deleteMultipleTasks(selecteds);

          setIsLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <TaskForm
            formRef={formRef}
            onCloseModal={onAddModalClose}
            setLoading={setIsLoading}
            origins={origins}
            classifications={classifications}
            types={types}
            departaments={departaments}
            setOrigins={setOrigins}
            setClassifications={setClassifications}
            setTypes={setTypes}
            setDepartaments={setDepartaments}
          />
        }
        formRef={formRef}
        title={t("Criar Tarefa")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        modalSize="2xl"
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <TaskForm
            formRef={formRef}
            onCloseModal={onEditModalClose}
            formValues={editSelected}
            setLoading={setIsLoading}
            event="edit"
          />
        }
        formRef={formRef}
        title={t("Editar Tarefa")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
        isLoading={isLoading}
      />
    </>
  );
};

export default compose(
  withAuthenticated("tasks"),
  withWarningCheck
)(ListTasksPage);
