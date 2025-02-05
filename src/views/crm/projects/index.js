import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  NotePencil,
  Trash,
  CheckFat,
  Folder,
  User,
  Chat,
} from "@phosphor-icons/react";
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
import ProjectsForm from "./components/projects-form";
import SquareInfos from "../components/squares-info";
import Filters from "./components/filters";
import { ProjectContext } from "providers/projects";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { AUDIT_EVENTS } from "constants/audit-events";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";

const ProjectsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const {
    getProjects,
    deleteProject,
    deleteMultipleProjects,
    createProject,
    status,
    editProject,
  } = useContext(ProjectContext);

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
      path: "/crm/projects",
      label: "Projetos",
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
    dispatchAuditEvent(AUDIT_EVENTS.CRM_PROJECTS_LIST);
    getProjects(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? ""
    ).then((res) => {
      setProjects(res.items);
      setPagination(res.pages);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateIcons = () => {
      const deleteIcon = checkPermissionForAction("crm", "canDelete")
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
            title: "Deletar",
          }
        : null;

      const editIcon = checkPermissionForAction("crm", "canEdit")
        ? {
            icon: <NotePencil size={20} />,
            onClickRow: (item) => {
              setEditSelected(item);
              onEditModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Editar",
          }
        : null;

      const tasks = checkPermissionForAction("crm", "canEdit")
        ? {
            icon: <CheckFat size={20} />,
            onClickRow: (item) => {
              window.open(`/tasks?projectId=${item.id}`, "_blank");
              // onEditModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Ir para tarefas",
          }
        : null;

      const documents = checkPermissionForAction("crm", "canEdit")
        ? {
            icon: <Folder size={20} />,
            onClickRow: (item) => {
              window.open(`/documents?projectId=${item.id}`);
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Ir para documentos",
          }
        : null;

      const shareWithUsers = checkPermissionForAction("crm", "canEdit")
        ? {
            icon: <User size={20} />,
            onClickRow: (item) => {
              setEditSelected(item);
              // onEditModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Compartilhar com clientes",
          }
        : null;

      const description = checkPermissionForAction("crm", "canEdit")
        ? {
            icon: <Chat size={20} />,

            onClickRow: (item) => {
              setEditSelected(item);
              // onEditModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Vizualizar descrição",
          }
        : null;

      const icons = [
        tasks,
        documents,
        shareWithUsers,
        // description,
        editIcon,
        deleteIcon,
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
    const res = await getProjects(
      page,
      queryParams.get("search") ?? "",
      setPagination
    );
    setPagination(res.pages);
    setProjects(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getProjects(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        setPagination
      );

      setPagination(res.pages);
      setProjects(res.items);
    }
  }, 500);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Projetos")}
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

          <Box
            display={"flex"}
            flexDir={{ base: "column", md: "row" }}
            justifyContent={"space-between"}
            w="100%"
          >
            <SquareInfos label={"Projetos iniciados"} value={status.started} />
            <SquareInfos label={"Projetos em pausa"} value={status.stopped} />
            <SquareInfos label={"Projetos finalizados"} value={status.ended} />
            <SquareInfos
              label={"Projetos em andamento"}
              value={status.inProgress}
            />
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

          <Box>
            <Filters
              onSearch={(projects, paginations) => {
                setPagination(paginations);
                setProjects(projects);
              }}
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
              data={projects}
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
                  data={projects}
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
        title={t("Excluir Projeto")}
        subtitle={t("Tem certeza de que deseja excluir este Projeto?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteProject(deleteId);
          if (response) {
            setProjects(
              projects.filter((category) => category.id !== deleteId)
            );
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Projetos")}
        subtitle={t("Tem certeza de que deseja excluir estes Projetos?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleProjects(selected, setProjects, projects);
          setIsDeleteLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <ProjectsForm
            formRef={categoryRef}
            onClose={(origin) => {
              onEditModalClose();
              const originsCopy = [...projects];
              const index = originsCopy.findIndex(
                (item) => item.id === origin.id
              );
              originsCopy[index] = origin;
              setProjects(originsCopy);
            }}
            event="edit"
            id={editSelected.id}
            formValues={editSelected}
            setLoading={setIsLoading}
            onEdit={editProject}
          />
        }
        formRef={categoryRef}
        title={t(`Editar`)}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <ProjectsForm
            formRef={categoryRef}
            onClose={(project) => {
              setProjects([project, ...projects]);
              onAddModalClose();
            }}
            onAdd={createProject}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Adicionar Projeto")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="2xl"
        isLoading={isLoading}
      />
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("crm"),
  withWarningCheck
)(ProjectsPage);
