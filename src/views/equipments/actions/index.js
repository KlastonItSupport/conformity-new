import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import { Trash } from "@phosphor-icons/react";
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

import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import { ButtonPrimary } from "components/button-primary";
import { TasksContext } from "providers/tasks";
import { mockedData } from "./table-helper";
import { ModalForm } from "components/components";
import ActionForm from "../forms/actions-form";

const ActionsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const formRef = useRef(null);

  const {
    deleteMultipleClassifications,
    deleteClassification,
    getClassifications,
  } = useContext(TasksContext);

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

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

  useEffect(() => {
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

      const icons = [deleteIcon].filter((icon) => icon !== null);

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
            disabled={!checkPermissionForAction("tasks", "canAdd")}
          />
        </HStack>

        <CustomTable
          data={mockedData}
          columns={columns}
          title={t("Ações do equipamento: Balança")}
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
        title={t("Excluir Documento")}
        subtitle={t("Tem certeza de que deseja excluir este Documento?")}
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
        title={t("Excluir Equipamentos")}
        subtitle={t("Tem certeza de que deseja excluir estas Equipamentos?")}
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
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <ActionForm
            formRef={formRef}
            onClose={(origin) => {
              onAddModalClose();
              const originsCopy = [...classifications];
              const index = originsCopy.findIndex(
                (item) => item.id === origin.id
              );
              originsCopy[index] = origin;
              setClassifications(originsCopy);
            }}
            event="edit"
          />
        }
        formRef={formRef}
        title={t("Adicionar Ação")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />
    </>
  );
};

export default ActionsPage;
