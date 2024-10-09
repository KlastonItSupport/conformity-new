import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotePencil, Trash, CheckFat, Gear, Info } from "@phosphor-icons/react";
import { NavBar } from "components/navbar";
import {
  Box,
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
import { columns } from "./table-helper";
import LeadsForm from "./components/leads-form";
import LeadsStatus from "./components/leads-status";
import SelectTableType from "./components/select-table-type";
import { tasksColumns } from "./table-helper";
import { LeadsContext } from "providers/leads";
import { LeadTaskContext } from "providers/leads-task";
import TaskModal from "./components/task-modal";

const LeadsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [paginationTasks, setPaginationTasks] = useState(null);
  const [selectedTable, setSelectedTable] = useState("leads");
  const [tasksLeads, setTasksLeads] = useState([]);
  const [tableIcons, setTableIcons] = useState([]);

  const isLeadsSelected = selectedTable === "leads";
  const { getLeadsTasks } = useContext(LeadTaskContext);

  const {
    getLeads,
    deleteLead,
    deleteMultipleLeads,
    createLead,
    editLead,
    leadsStatus,
  } = useContext(LeadsContext);

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/crm/leads",
      label: "Leads",
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
    isOpen: isTasksModalOpen,
    onOpen: onTasksModalOpen,
    onClose: onTasksModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  useEffect(() => {
    getLeads(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      setPagination
    ).then((res) => {
      setLeads(res.items);
      setPagination(res.pages);
    });

    getLeadsTasks(
      searchParams.get("pageTasks") ?? 1,
      searchParams.get("searchTasks") ?? ""
    ).then((res) => {
      setTasksLeads(res.items);
      setPaginationTasks(res.pages);
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

      const tasks = checkPermissionForAction("tasks", "canEdit")
        ? {
            icon: <CheckFat size={20} />,
            onClickRow: (item) => {
              setEditSelected(item);
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Ir para tarefas",
          }
        : null;

      const services = checkPermissionForAction("tasks", "canEdit")
        ? {
            icon: <Gear size={20} />,
            onClickRow: (item) => {},
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Ir para serviços",
          }
        : null;

      const tasksModal = checkPermissionForAction("tasks", "canEdit")
        ? {
            icon: <Info size={20} />,
            onClickRow: (item) => {
              setSelected(item);
              onTasksModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Vizualizar tarefas",
          }
        : null;

      const icons = [tasks, services, tasksModal, editIcon, deleteIcon].filter(
        (icon) => icon !== null
      );

      setTableIcons(icons);
    };

    updateIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, userAccessRule]); // Atualiza os ícones quando userPermissions muda

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);

    const res = await getLeads(page, queryParams.get("search") ?? "");

    setPagination(res.pages);
    setLeads(res.items);
  };

  const updateDataLeadsTasks = async (page) => {
    searchParams.set("pageTasks", page);
    setSearchParams(searchParams);

    const res = await getLeadsTasks(page, queryParams.get("searchTasks") ?? "");

    setPaginationTasks(res.pages);
    setTasksLeads(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getLeads(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        setPagination
      );

      setPagination(res.pages);
      setLeads(res.items);
    }
  }, 500);

  const debouncedSearchTasks = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("searchTasks", inputValue);
      searchParams.set("pageTasks", 1);

      const res = await getLeadsTasks(
        searchParams.get("pageTasks") ?? 1,
        searchParams.get("searchTasks") ?? ""
      );

      setPaginationTasks(res.pages);
      setTasksLeads(res.items);
    }
  }, 500);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <LeadsStatus
          cancelled={leadsStatus.cancelled}
          requested={leadsStatus.requested}
          refused={leadsStatus.refused}
          inProgress={leadsStatus.inProgress}
          completed={leadsStatus.completed}
          total={leadsStatus.total}
        />
        <SelectTableType
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />
        <HStack justify={"start"} w={"95vw"} py={"20px"}>
          {selectedTable === "leads" && (
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
              width="150px"
              onClick={onAddModalOpen}
              disabled={!checkPermissionForAction("tasks", "canAdd")}
            />
          )}
          {selectedTable !== "leads" && <Box height={50}></Box>}
        </HStack>

        {selectedTable === "leads" && (
          <CustomTable
            data={leads}
            columns={columns}
            title={t("Leads cadastradas")}
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
        )}
        {selectedTable === "tasks" && (
          <CustomTable
            data={tasksLeads}
            columns={tasksColumns}
            title={t("Tarefas cadastradas")}
            searchInputValue={searchParams.get("searchTasks") ?? ""}
            onChangeSearchInput={(e) => debouncedSearchTasks(e.target.value)}
            iconsHasMaxW={true}
          />
        )}
        <Flex
          justifyContent={"end"}
          w={isMobile ? "99vw" : "95vw"}
          bgColor={"white"}
        >
          {pagination && (
            <Pagination
              data={isLeadsSelected ? leads : tasksLeads}
              onClickPagination={
                isLeadsSelected ? updateData : updateDataLeadsTasks
              }
              itemsPerPage={5}
              totalPages={
                isLeadsSelected
                  ? pagination.totalPages
                  : paginationTasks.totalPages
              }
              currentPage={
                isLeadsSelected
                  ? pagination.currentPage
                  : paginationTasks.currentPage
              }
              nextPage={
                isLeadsSelected ? pagination.next : paginationTasks.next
              }
              lastPage={
                isLeadsSelected ? pagination.last : paginationTasks.last
              }
            />
          )}
        </Flex>
      </VStack>
      <DeleteModal
        title={t("Excluir Lead")}
        subtitle={t("Tem certeza de que deseja excluir este Lead?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteLead(deleteId);
          if (response) {
            setLeads(leads.filter((category) => category.id !== deleteId));
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Leads")}
        subtitle={t("Tem certeza de que deseja excluir estes Leads?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleLeads(selected, setLeads, leads);
          setIsDeleteLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <LeadsForm
            formRef={categoryRef}
            onClose={(origin) => {
              onEditModalClose();
              const originsCopy = [...leads];
              const index = originsCopy.findIndex(
                (item) => item.id === origin.id
              );
              originsCopy[index] = origin;
              setLeads(originsCopy);
            }}
            event="edit"
            id={editSelected.id}
            formValues={editSelected}
            setLoading={setIsLoading}
            onEdit={editLead}
          />
        }
        formRef={categoryRef}
        title={t(`Editar Lead`)}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <LeadsForm
            formRef={categoryRef}
            onClose={(origin) => {
              onAddModalClose();
              setLeads([origin, ...leads]);
            }}
            setLoading={setIsLoading}
            onAdd={createLead}
          />
        }
        formRef={categoryRef}
        title={t("Adicionar Lead")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="2xl"
        isLoading={isLoading}
      />
      {isTasksModalOpen && (
        <TaskModal
          isOpen={isTasksModalOpen}
          onClose={onTasksModalClose}
          isLoading={isDeleteLoading}
          id={selected.id}
        />
      )}
    </>
  );
};

export default LeadsPage;
