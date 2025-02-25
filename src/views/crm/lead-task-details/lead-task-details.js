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
  useBreakpointValue,
  Box,
  Container,
} from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";
import { DeleteModal } from "components/components";

import { ModalForm } from "components/components";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import { ButtonPrimary } from "components/button-primary";
import { LeadTaskContext } from "providers/leads-task";
import LeadTaskForm from "./components/lead-task-form";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { useSidebar } from 'contexts/SidebarContext';
import Wrapper from "components/wrapper";
import { TopNavigation } from "components/top-navigation";

const LeadsTaskDetailsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const name = queryParams.get("name");

  const {
    getLeadsTasks,
    createTaskLead,
    deleteTaskLead,
    deleteMultipleTaskLead,
    editTaskLead,
  } = useContext(LeadTaskContext);

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
      isCurrent: false,
    },
    {
      path: "/crm/leads/tasks",
      label: "Tarefas",
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

  const { isCollapsed } = useSidebar();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    getLeadsTasks(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      id
    ).then((res) => {
      setServices(res.items);
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

      const icons = [editIcon, deleteIcon].filter((icon) => icon !== null);

      setTableIcons(icons);
    };

    updateIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, userAccessRule]);

  const [tableIcons, setTableIcons] = useState([]);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    const res = await getLeadsTasks(page, queryParams.get("search") ?? "", id);
    setPagination(res.pages);
    setServices(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getLeadsTasks(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        id
      );

      setPagination(res.pages);
      setServices(res.items);
    }
  }, 500);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t(`Tarefas do lead: ${name}`)}
      />
      <Box
        marginTop="64px"
        marginLeft={isCollapsed ? "0px" : "0px"}
        transition="all 0.3s ease"
        minH="calc(100vh - 64px)"
        bg="#FAFAFA"
        p={6}
        width={`calc(100% - ${isCollapsed ? "60px" : "240px"})`}
        overflow="auto"
      >
        <Flex
          direction={isMobile ? "column" : "row"}
          gap={6}
          w="100%"
          flexWrap="wrap"
        >
          <Box
            flex={1}
            minW={isMobile ? "100%" : "600px"}
            bg="white"
            borderRadius="lg"
            p={6}
            boxShadow="sm"
          >
            <HStack justify="start" w="100%" py={4}>
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
                minW="150px"
                disabled={!checkPermissionForAction("tasks", "canAdd")}
              />
            </HStack>

            <CustomTable
              data={services}
              columns={columns}
              title={t(`Tarefas do lead: ${name}`)}
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
            
            <Flex justifyContent="end" w="100%" pt={4}>
              {pagination && (
                <Pagination
                  data={services}
                  onClickPagination={updateData}
                  itemsPerPage={5}
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                  nextPage={pagination.next}
                  lastPage={pagination.last}
                />
              )}
            </Flex>
          </Box>

          <Box
            w={isMobile ? "100%" : "350px"}
            bg="white"
            borderRadius="lg"
            p={6}
            boxShadow="sm"
            flexShrink={0}
            h="fit-content"
          >
            {/* Additional task details */}
          </Box>
        </Flex>

        <DeleteModal
          title={t("Excluir Tarefa")}
          subtitle={t("Tem certeza de que deseja excluir esta Tarefa?")}
          isOpen={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          onConfirm={async () => {
            setIsLoading(true);

            const response = await deleteTaskLead(deleteId);
            if (response) {
              setServices(
                services.filter((category) => category.id !== deleteId)
              );
            }

            setIsLoading(false);
            onDeleteModalClose();
          }}
          isLoading={isLoading}
        />
        <DeleteModal
          title={t("Excluir Tarefa")}
          subtitle={t("Tem certeza de que deseja excluir estas Tarefas?")}
          isOpen={isDeleteMultipleModalOpen}
          onClose={onDeleteMultipleModalClose}
          onConfirm={async () => {
            setIsDeleteLoading(true);
            await deleteMultipleTaskLead(selected, setServices, services);
            setIsDeleteLoading(false);
            onDeleteMultipleModalClose();
          }}
          isLoading={isDeleteLoading}
        />
        <ModalForm
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          form={
            <LeadTaskForm
              formRef={categoryRef}
              onClose={(origin) => {
                onEditModalClose();
                const servicesCopy = [...services];
                const index = servicesCopy.findIndex(
                  (item) => item.id === origin.id
                );
                servicesCopy[index] = origin;
                setServices(servicesCopy);
              }}
              event="edit"
              onEdit={editTaskLead}
              leadTaskId={editSelected.id}
              formValues={editSelected}
              setLoading={setIsLoading}
            />
          }
          formRef={categoryRef}
          title={t("Editar Tarefa")}
          leftButtonLabel={t("Cancelar")}
          rightButtonLabel={t("Editar")}
          modalSize="xl"
          isLoading={isLoading}
        />

        <ModalForm
          isOpen={isAddModalOpen}
          onClose={onAddModalClose}
          form={
            <LeadTaskForm
              formRef={categoryRef}
              onClose={(origin) => {
                onAddModalClose();
                setServices([origin, ...services]);
              }}
              event="add"
              onAdd={createTaskLead}
              setLoading={setIsLoading}
            />
          }
          formRef={categoryRef}
          title={t("Adicionar Tarefa")}
          leftButtonLabel={t("Cancelar")}
          rightButtonLabel={t("Adicionar")}
          modalSize="xl"
          isLoading={isLoading}
        />
      </Box>
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("crm"),
  withWarningCheck
)(LeadsTaskDetailsPage);
