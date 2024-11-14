import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotePencil, Trash, DownloadSimple } from "@phosphor-icons/react";
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
import ContractForm from "./components/contract-form";
import SquareInfos from "../components/squares-info";
import { ContractContext } from "providers/contract";
import { compose } from "recompose";
import withWarningCheck from "hoc/with-warning-check";
import withAuthenticated from "hoc/with-authenticated";

const ContractsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const {
    getContracts,
    deleteContract,
    deleteMultipleContracts,
    contractsByStatus,
    createContract,
    editContract,
  } = useContext(ContractContext);

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/crm/contracts",
      label: "Contratos",
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
    getContracts(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      setPagination
    ).then((res) => {
      setContracts(res.items);
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
          }
        : null;

      const downloadIcon = checkPermissionForAction("crm", "canEdit")
        ? {
            icon: <DownloadSimple size={20} />,
            onClickRow: (item) => {
              window.open(item.link);
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Vizualizar Documento",
          }
        : null;
      const icons = [downloadIcon, editIcon, deleteIcon].filter(
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
    const res = await getContracts(
      page,
      queryParams.get("search") ?? "",
      setPagination
    );
    setPagination(res.pages);
    setContracts(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getContracts(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        setPagination
      );

      setPagination(res.pages);
      setContracts(res.items);
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
          <SquareInfos
            label={"Contratos Ativos"}
            value={contractsByStatus.active}
          />
          <SquareInfos
            label={"Contratos Inativos"}
            value={contractsByStatus.unactive}
          />
          <SquareInfos
            label={"Contratos Cancelados"}
            value={contractsByStatus.cancelled}
          />
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
            disabled={!checkPermissionForAction("crm", "canAdd")}
          />
        </HStack>

        <CustomTable
          data={contracts}
          columns={columns}
          title={t("Contratos")}
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
              data={contracts}
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
        title={t("Excluir Contrato")}
        subtitle={t("Tem certeza de que deseja excluir este Contrato?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteContract(deleteId);
          if (response) {
            setContracts(
              contracts.filter((category) => category.id !== deleteId)
            );
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Contratos")}
        subtitle={t("Tem certeza de que deseja excluir estes Contratos?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleContracts(selected, setContracts, contracts);
          setIsDeleteLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <ContractForm
            formRef={categoryRef}
            onClose={(contract) => {
              onEditModalClose();
              const contractsCopy = [...contracts];
              const index = contractsCopy.findIndex(
                (item) => item.id === contract.id
              );
              contractsCopy[index] = contract;
              setContracts(contractsCopy);
            }}
            event="edit"
            onEdit={editContract}
            id={editSelected.id}
            formValues={editSelected}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t(`Editar: ${editSelected.title}`)}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <ContractForm
            formRef={categoryRef}
            onClose={(origin) => {
              onAddModalClose();
              setContracts([origin, ...contracts]);
            }}
            setLoading={setIsLoading}
            onAdd={createContract}
          />
        }
        formRef={categoryRef}
        title={t("Adicionar Contrato")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="2xl"
        isLoading={isLoading}
      />
    </>
  );
};

export default compose(
  withAuthenticated("crm"),
  withWarningCheck
)(ContractsPage);
