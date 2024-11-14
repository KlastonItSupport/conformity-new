import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import { NotePencil, Trash, MapPin } from "@phosphor-icons/react";
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
import ClientSupplierForm from "../components/client-supplier-form/client-supplier-form";
import { CrmContext } from "providers/crm";
import { AddressModal } from "../components/address-info";
import withAuthenticated from "hoc/with-authenticated";
import { compose } from "recompose";
import withWarningCheck from "hoc/with-warning-check";

const ClientsSuppliers = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [addressInfo, setAddressInfo] = useState({
    cep: "",
    state: "",
    city: "",
    neighborhood: "",
    number: "",
    complement: "",
  });
  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [crm, setCrm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const { getCrm, deleteCrm, deleteMultipleCrm, createCrm, updateCrm } =
    useContext(CrmContext);

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/crm/clients-suppliers",
      label: "Clientes / Fornecedores",
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

  const {
    isOpen: isAddressModalOpen,
    onOpen: onAddressModalOpen,
    onClose: onAddressModalClose,
  } = useDisclosure();

  useEffect(() => {
    getCrm(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      setPagination
    ).then((res) => {
      setCrm(res.items);
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

      const mapIcon = checkPermissionForAction("crm", "canEdit")
        ? {
            icon: <MapPin size={20} />,
            onClickRow: (item) => {
              setAddressInfo({
                cep: item?.cep,
                state: item.state,
                city: item.city,
                neighborhood: item.neighborhood,
                number: item.number,
                complement: item.addressComplement,
              });
              onAddressModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
            title: "Vizualizar endereços",
          }
        : null;
      const icons = [deleteIcon, editIcon, mapIcon].filter(
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
    const res = await getCrm(
      page,
      queryParams.get("search") ?? "",
      setPagination
    );
    setPagination(res.pages);
    setCrm(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getCrm(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        setPagination
      );

      setPagination(res.pages);
      setCrm(res.items);
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
            label={"NOVO CLIENTE / FORNECEDOR"}
            onClick={onAddModalOpen}
            disabled={!checkPermissionForAction("crm", "canAdd")}
          />
        </HStack>

        <CustomTable
          data={crm}
          columns={columns}
          title={t("Clientes / Fornecedores")}
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
              data={crm}
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
        title={t("Excluir Cliente/Fornecedor")}
        subtitle={t(
          "Tem certeza de que deseja excluir este Cliente/Fornecedor?"
        )}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteCrm(deleteId);
          if (response) {
            setCrm(crm.filter((category) => category.id !== deleteId));
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Tipos")}
        subtitle={t(
          "Tem certeza de que deseja excluir estes Clientes/Fornecedores?"
        )}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleCrm(selected, setCrm, crm);
          setIsDeleteLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <ClientSupplierForm
            formRef={categoryRef}
            onClose={(origin) => {
              onEditModalClose();
              const originsCopy = [...crm];
              const index = originsCopy.findIndex(
                (item) => item.id === origin.id
              );
              originsCopy[index] = origin;
              setCrm(originsCopy);
            }}
            onEdit={updateCrm}
            event="edit"
            id={editSelected.id}
            formValues={editSelected}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Editar Cliente/Fornecedor")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <ClientSupplierForm
            formRef={categoryRef}
            onClose={(origin) => {
              onAddModalClose();
              setCrm([origin, ...crm]);
            }}
            onAdd={createCrm}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Adicionar Cliente/Fornecedor")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="2xl"
        isLoading={isLoading}
      />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={onAddressModalClose}
        addressInfo={addressInfo}
      />
    </>
  );
};

export default compose(
  withAuthenticated("crm"),
  withWarningCheck
)(ClientsSuppliers);
