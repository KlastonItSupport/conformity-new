import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import { Gear, NotePencil, Trash } from "@phosphor-icons/react";
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
import { ButtonPrimary } from "components/button-primary";
import EquipmentForm from "./forms/equipment-form";
import { EquipmentContext } from "providers/equipments";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import Wrapper from "components/wrapper";

const EquipmmentsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [deleteId, setDeleteId] = useState(false);
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    deleteMultipleEquipments,
    deleteEquipment,
    getEquipments,
    equipments,
    pagination,
    createEquipment,
    updateEquipment,
  } = useContext(EquipmentContext);

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/tasks/equipments",
      label: "Equipamentos",
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
    getEquipments(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? ""
    );

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

      const editIcon = checkPermissionForAction("equipments", "canEdit")
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

      const actions = checkPermissionForAction("equipments", "canEdit")
        ? {
            icon: <Gear size={20} />,
            onClickRow: (item) => {
              // setEditSelected(item);
              // onEditModalOpen();
              navigate(`/equipments/actions?id=${item.id}&name=${item.name}`);
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
          }
        : null;

      const icons = [actions, editIcon, deleteIcon].filter(
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
    await getEquipments(page, queryParams.get("search") ?? "");
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      await getEquipments(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? ""
      );
    }
  }, 500);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <HStack justify={"start"} w={"100%"} pb={"10px"}>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="40px"
            bgColor={"header.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Adicionar"}
            onClick={onAddModalOpen}
            width="150px"
            disabled={!checkPermissionForAction("equipments", "canAdd")}
          />
        </HStack>

        <CustomTable
          data={equipments}
          columns={columns}
          title={t("Equipamentos")}
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
              data={equipments}
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
        title={t("Excluir Classificação")}
        subtitle={t("Tem certeza de que deseja excluir esta Classificação?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          await deleteEquipment(deleteId);

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
          setIsLoading(true);
          await deleteMultipleEquipments(selected);
          onDeleteMultipleModalClose();
          setIsLoading(false);
        }}
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <EquipmentForm
            formRef={categoryRef}
            onClose={onEditModalClose}
            onEdit={updateEquipment}
            event="edit"
            id={editSelected.id}
            formValues={editSelected}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Editar Classificação")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <EquipmentForm
            formRef={categoryRef}
            onClose={onAddModalClose}
            onAdd={createEquipment}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Adicionar Equipamento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
        isLoading={isLoading}
      />
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("equipments"),
  withWarningCheck
)(EquipmmentsPage);
