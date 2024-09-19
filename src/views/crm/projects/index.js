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
import { TasksContext } from "providers/tasks";
import { columns, mockedData } from "./table-helper";
import ProjectsForm from "./components/projects-form";
import SquareInfos from "../components/squares-info";
import Filters from "./components/filters";

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
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const { getTypes, deleteType, deleteMultipleTypes } =
    useContext(TasksContext);

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

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
    getTypes(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      setPagination
    ).then((res) => {
      setTypes(res.items);
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
            title: "Deletar",
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
            title: "Editar",
          }
        : null;

      const tasks = checkPermissionForAction("tasks", "canEdit")
        ? {
            icon: <CheckFat size={20} />,
            onClickRow: (item) => {
              setEditSelected(item);
              // onEditModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Ir para tarefas",
          }
        : null;

      const documents = checkPermissionForAction("tasks", "canEdit")
        ? {
            icon: <Folder size={20} />,
            onClickRow: (item) => {
              setEditSelected(item);
              // onEditModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Ir para documentos",
          }
        : null;

      const shareWithUsers = checkPermissionForAction("tasks", "canEdit")
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

      const description = checkPermissionForAction("tasks", "canEdit")
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
        description,
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
    const res = await getTypes(
      page,
      queryParams.get("search") ?? "",
      setPagination
    );
    setPagination(res.pages);
    setTypes(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getTypes(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        setPagination
      );

      setPagination(res.pages);
      setTypes(res.items);
    }
  }, 500);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <Box
          display={"flex"}
          flexDir={{ base: "column", md: "row" }} // "base" é para mobile, "md" para telas maiores
          justifyContent={"space-between"}
          w={"95vw"}
        >
          <SquareInfos label={"Projetos iniciados"} value={"10"} />
          <SquareInfos label={"Projetos em pausa"} value={"5"} />
          <SquareInfos label={"Projetos finalizados"} value={"2"} />
          <SquareInfos label={"Projetos em andamento"} value={"2"} />
        </Box>

        <HStack justify={"start"} w={"95vw"} py={"20px"}>
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
        </HStack>
        <Filters />
        <CustomTable
          data={mockedData}
          columns={columns}
          title={t("Projetos")}
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
              data={types}
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
        title={t("Excluir Projeto")}
        subtitle={t("Tem certeza de que deseja excluir este Projeto?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteType(deleteId);
          if (response) {
            setTypes(types.filter((category) => category.id !== deleteId));
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
          await deleteMultipleTypes(selected, setTypes, types);
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
              const originsCopy = [...types];
              const index = originsCopy.findIndex(
                (item) => item.id === origin.id
              );
              originsCopy[index] = origin;
              setTypes(originsCopy);
            }}
            event="edit"
            id={editSelected.id}
            formValues={editSelected}
            setLoading={setIsLoading}
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
            onClose={(origin) => {
              onAddModalClose();
              setTypes([origin, ...types]);
            }}
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
    </>
  );
};

export default ProjectsPage;
