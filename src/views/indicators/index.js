import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns, mockedData } from "./table-helper";
import { ChartLineUp, NotePencil, Plus, Trash } from "@phosphor-icons/react";
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
import IndicatorForm from "./components/indicator-form";

const IndicatorsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [origins, setOrigins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const { getOrigins, deleteOrigin, deleteMultipleOrigins } =
    useContext(TasksContext);

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/indicators",
      label: "Indicadores",
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
    getOrigins(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      setPagination
    ).then((res) => {
      setOrigins(res.items);
      setPagination(res.pages);
    });

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
            onClickHeader: (selecteds) => {
              setSelected(selecteds);
              onDeleteMultipleModalOpen();
            },
            isDisabled: false,
            shouldShow: true,
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

      const graphIcon = checkPermissionForAction("documents", "canEdit")
        ? {
            icon: <ChartLineUp size={20} />,
            onClickRow: (item) => {},
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
          }
        : null;

      const addDataToIndicator = checkPermissionForAction(
        "documents",
        "canEdit"
      )
        ? {
            icon: <Plus size={20} />,
            onClickRow: (item) => {},
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
          }
        : null;
      const icons = [
        graphIcon,
        addDataToIndicator,
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
    const res = await getOrigins(
      page,
      queryParams.get("search") ?? "",
      setPagination
    );
    setPagination(res.pages);
    setOrigins(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getOrigins(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        setPagination
      );

      setPagination(res.pages);
      setOrigins(res.items);
    }
  }, 500);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
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
            onClick={onAddModalOpen}
            width="150px"
            disabled={!checkPermissionForAction("documents", "canAdd")}
          />
        </HStack>

        <CustomTable
          data={mockedData}
          columns={columns}
          title={t("Indicadores")}
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
              data={origins}
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
        title={t("Excluir Origem")}
        subtitle={t("Tem certeza de que deseja excluir este Indicador?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteOrigin(deleteId);
          if (response) {
            setOrigins(origins.filter((category) => category.id !== deleteId));
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Origem")}
        subtitle={t("Tem certeza de que deseja excluir estes Indicadores?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleOrigins(selected, setOrigins, origins);
          setIsDeleteLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <IndicatorForm
            formRef={categoryRef}
            onClose={onAddModalClose}
            onEdit={() => {}}
            event="edit"
            formValues={editSelected}
          />
        }
        formRef={categoryRef}
        title={t("Editar Origem")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <IndicatorForm
            formRef={categoryRef}
            onClose={onAddModalClose}
            onAdd={() => {}}
            event="add"
          />
        }
        formRef={categoryRef}
        title={t("Adicionar Origem")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="2xl"
        isLoading={isLoading}
      />
    </>
  );
};

export default IndicatorsPage;
