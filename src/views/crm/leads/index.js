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
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { AUDIT_EVENTS } from "constants/audit-events";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";

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
    dispatchAuditEvent(AUDIT_EVENTS.CRM_LEADS_LIST);
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
              window.open(
                `/crm/leads/tasks/${item.id}?name=${item.crmCompanyName}`
              );
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Ir para tarefas",
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

      const icons = [tasks, tasksModal, editIcon, deleteIcon].filter(
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
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Leads")}
      />
      <Box
        marginTop="64px"
        w="100%"
        px={6}
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
            <ButtonPrimary
              fontSize="sm"
              fontWeight="bold"
              h="40px"
              bgColor="header.100"
              _hover={{ bgColor: "primary.200" }}
              textColor="white"
              boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
              borderRadius="7px"
              _active={{ bgColor: "primary.200" }}
              label="Adicionar"
              onClick={onAddModalOpen}
              width="150px"
              disabled={!checkPermissionForAction("crm", "canAdd")}
            />
          </Box>
          
          <Box 
            w="100%" 
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
          >
            <CustomTable
              data={leads}
              columns={columns}
              title={t("")}
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
            {pagination && (
              <Box 
                p={4} 
                borderTop="1px solid" 
                borderColor="gray.100"
              >
                <Pagination
                  data={leads}
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
        </VStack>
      </Box>

      {/* Modals */}
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
    </Wrapper>
  );
};

export default compose(withAuthenticated("crm"), withWarningCheck)(LeadsPage);
