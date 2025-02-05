import { Box, Flex, VStack, useDisclosure } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import React, { useContext, useEffect, useRef, useState } from "react";
import CustomTable from "../../components/customTable";
import { columns, formatOnDownLoad } from "./table-helper";
import { Trash, NotePencil } from "@phosphor-icons/react";
import { ModalForm } from "components/modals/modalForm";
import DeleteModal from "components/modals/delete-modal";
import { GroupForm } from "components/forms/groups/group";
import { GroupContext } from "providers/group";
import { Pagination } from "components/pagination/pagination";
import { useQuery } from "hooks/query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { useBreakpoint } from "hooks/usebreakpoint";
import { AuthContext } from "providers/auth";
import { useTranslation } from "react-i18next";
import withWarningCheck from "hoc/with-warning-check";
import withAuthenticated from "hoc/with-authenticated";
import { compose } from "recompose";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";

const GroupsPage = () => {
  const formRef = useRef(null);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const history = useNavigate();

  const { isMobile } = useBreakpoint();
  const { dealingWithAuth, getUserInfo } = useContext(AuthContext);
  const {
    groups,
    itemsPerPage,
    getGroups,
    deleteGroup,
    handleChangeDeleteId,
    deleteId,
    selecteds,
    handleChangeSelectedsIds,
    setGroups,
    createGroupIsLoading,
    editSelected,
    setEditSelected,
    selectedIsLoading,
    deleteGroupIsLoading,
    setDeleteGroupIsLoading,
    pagination,
  } = useContext(GroupContext);

  const debouncedSearch = debounce((inputValue) => {
    searchParams.set("search", inputValue);
    searchParams.set("page", 1);
    setSearchParams(searchParams);
    getGroups(true, 1, inputValue);
  }, 500);

  const {
    isOpen: isAddGroupModalOpen,
    onOpen: onAddGroupModalOpen,
    onClose: onAddGroupModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteSelectedGroups,
    onOpen: onDeleteSelectedGroupsOpen,
    onClose: onDeleteSelectedGroupsClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const onDeleteModalConfirm = async () => {
    setDeleteGroupIsLoading(true);
    await deleteGroup(deleteId);
    setDeleteGroupIsLoading(false);
    onDeleteModalClose();
  };
  const onDeleteOpenModal = (id) => {
    handleChangeDeleteId(id);
    onDeleteModalOpen();
  };

  const onDeleteSelectedOpenModal = (selecteds) => {
    handleChangeSelectedsIds(selecteds);
    onDeleteSelectedGroupsOpen();
  };
  const onConfirmDeleteSelecteds = async () => {
    const deletePromises = selecteds.map((selected) =>
      selected.id !== "checkall" ? deleteGroup(selected.id) : () => {}
    );

    await Promise.all(deletePromises);

    setGroups(
      groups.filter(
        (group) => !selecteds.some((selected) => selected.id === group.id)
      )
    );

    onDeleteSelectedGroupsClose();
  };

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <NotePencil size={20} />,
      onClickRow: (item) => onEditModalOpenHandle(item),
      onClickHeader: () => [],
      isDisabled: false,
      shouldShow: false,
    },
    {
      icon: <Trash size={20} />,
      onClickRow: (item) => onDeleteOpenModal(item.id),
      onClickHeader: (selecteds) => onDeleteSelectedOpenModal(selecteds),
      isDisabled: false,
      shouldShow: true,
    },
  ]);

  const onEditModalOpenHandle = (item) => {
    onEditModalOpen();
    setEditSelected(item);
  };
  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/groups",
      label: "Grupos",
      isCurrent: true,
    },
  ];

  const updateData = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);

    getGroups(true, page, queryParams.get("search"));
  };

  useEffect(() => {
    dealingWithAuth(true, "/groups", history);

    const fetchData = async () => {
      if (!getUserInfo()) {
        return;
      }
      const currentPage = queryParams.get("page");
      const searchQuery = queryParams.get("search");

      if (!currentPage) {
        searchParams.set("page", 1);
        setSearchParams(searchParams);
      }
      if (!searchQuery) {
        searchParams.set("search", "");
        setSearchParams(searchParams);
      }

      getGroups(
        true,
        !currentPage ? 1 : currentPage,
        !searchQuery ? "" : searchQuery
      );
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Grupos")}
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
              label={` + ${t("Adicionar")}`}
              width="150px"
              onClick={onAddGroupModalOpen}
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
              data={groups}
              columns={columns}
              title=""
              icons={tableIcons}
              onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
              searchInputValue={queryParams.get("search")}
              onCheckItems={(show) => {
                setTableIcons(
                  tableIcons.map((icon) => {
                    icon.isDisabled = show;
                    return icon;
                  })
                );
              }}
              formatOnDownLoad={formatOnDownLoad}
            />
            {pagination && (
              <Box 
                p={4} 
                borderTop="1px solid" 
                borderColor="gray.100"
              >
                <Pagination
                  data={groups}
                  onClickPagination={updateData}
                  itemsPerPage={itemsPerPage}
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

      <ModalForm
        isOpen={isAddGroupModalOpen}
        onClose={onAddGroupModalClose}
        id={""}
        form={
          <GroupForm formRef={formRef} onCloseModal={onAddGroupModalClose} />
        }
        formRef={formRef}
        title={t("Adicionar Grupo")}
        description={""}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={createGroupIsLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        id={"editId"}
        form={
          <GroupForm
            formRef={formRef}
            formValues={editSelected}
            type="edit"
            onCloseModal={onEditModalClose}
          />
        }
        formRef={formRef}
        title={t("Editar Grupo")}
        description={t("Tem certeza de que deseja Editar este Grupo?")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={selectedIsLoading}
      />
      <DeleteModal
        title={t("Excluir Grupo")}
        subtitle={t("Tem certeza de que deseja excluir este Grupo?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={onDeleteModalConfirm}
        isLoading={deleteGroupIsLoading}
      />
      <DeleteModal
        title={t("Excluir Grupo")}
        subtitle={t("Tem certeza de que deseja excluir estes Grupos?")}
        isOpen={isDeleteSelectedGroups}
        onClose={onDeleteSelectedGroupsClose}
        onConfirm={onConfirmDeleteSelecteds}
      />
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("companies"),
  withWarningCheck
)(GroupsPage);
