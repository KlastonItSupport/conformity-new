import { useRef, useState } from "react";
import { Box, VStack, useDisclosure } from "@chakra-ui/react";
import { AuthContext } from "providers/auth";
import { useContext, useEffect } from "react";
import { columns } from "./components/table-helper";
import { Key, NotePencil, Trash } from "@phosphor-icons/react";
import { UserContext } from "providers/users";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import {
  NavBar,
  NavigationLinks,
  ButtonPrimary,
  CustomTable,
  ModalForm,
  Pagination,
  EditUsersForm,
  EditUsersPasswordForm,
  DeleteModal,
  AddUserForm,
} from "components/components";
import { useBreakpoint } from "hooks/usebreakpoint";
import { useTranslation } from "react-i18next";
import { AUDIT_EVENTS } from "constants/audit-events";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";

const UsersPage = () => {
  const { getUserInfo, dispatchAuditEvent } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  const queryParams = useQuery();

  const itemsPerPage = 10;
  const {
    deleteId,
    changeDeleteId,
    editId,
    setEditId,
    users,
    setUsers,
    getUsersFromThisCompany,
    deleteUser,
    deleteIsLoading,
    selectedItems,
    setSelectedItems,
    selectedIsLoading,
    setSelectedIsLoading,
    createUserIsLoading,
    changePassword,
    changePasswordIsLoading,
    setEditPasswordId,
    editIsLoading,
    pagination,
  } = useContext(UserContext);

  const formRef = useRef(null);

  const updateData = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    getUsersFromThisCompany(page, queryParams.get("search"));
  };

  const debouncedSearch = debounce((inputValue) => {
    if (inputValue.length >= 3 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);
      setSearchParams(searchParams);
      getUsersFromThisCompany(1, inputValue);
    }
  }, 500);

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.COMPANY_USERS_LIST);
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

      getUsersFromThisCompany(
        !currentPage ? 1 : currentPage,
        !searchQuery ? "" : searchQuery
      );
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditPasswordModalOpen,
    onOpen: onEditPasswordModalOpen,
    onClose: onEditPasswordModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddUserModalOpen,
    onOpen: onAddUserModalOpen,
    onClose: onAddUserModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteSelectedUsers,
    onOpen: onDeleteSelectedUsersOpen,
    onClose: onDeleteSelectedUsersClose,
  } = useDisclosure();

  const handleEditModalOpen = (item) => {
    setEditId(item);
    onEditModalOpen();
  };

  const handleDeleteModalOpen = async (item) => {
    changeDeleteId(item);
    onDeleteModalOpen();
  };

  const handlePasswordChangeModalOpen = (item) => {
    setEditPasswordId(item);
    onEditPasswordModalOpen();
  };

  const onDeleteSelectedOpenModal = (selecteds) => {
    setSelectedItems(selecteds);
    onDeleteSelectedUsersOpen();
  };

  const onConfirmDeleteSelecteds = async () => {
    setSelectedIsLoading(true);
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall" ? deleteUser(selected.id) : () => {}
    );

    await Promise.all(deletePromises);

    setUsers(
      users.filter(
        (group) => !selectedItems.some((selected) => selected.id === group.id)
      )
    );

    setSelectedIsLoading(false);
    onDeleteSelectedUsersClose();
  };

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <NotePencil size={20} />,
      onClickRow: handleEditModalOpen,
      onClickHeader: () => [],
      isDisabled: false,
      shouldShow: false,
    },
    {
      icon: <Trash size={20} />,
      onClickRow: handleDeleteModalOpen,
      onClickHeader: (selecteds) => onDeleteSelectedOpenModal(selecteds),
      isDisabled: false,
      shouldShow: true,
    },
    {
      icon: <Key size={20} />,
      onClickRow: handlePasswordChangeModalOpen,
      onClickHeader: () => [],
      isDisabled: false,
      shouldShow: false,
    },
  ]);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/users",
      label: t("Usuários"),
      isCurrent: true,
    },
  ];

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Usuários")}
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
              onClick={onAddUserModalOpen}
              width="150px"
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
              data={users}
              columns={columns}
              title={t("")}
              actionButtons={[
                <NotePencil size={20} cursor={"pointer"} color="black" />,
                <Trash size={20} cursor={"pointer"} color="black" />,
                <Key size={20} cursor={"pointer"} color="black" />,
              ]}
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
            />
            {pagination && (
              <Box 
                p={4} 
                borderTop="1px solid" 
                borderColor="gray.100"
              >
                <Pagination
                  data={users}
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

      {/* Modals */}
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <EditUsersForm
            formRef={formRef}
            onCloseModal={onEditModalClose}
            formValues={editId}
          />
        }
        formRef={formRef}
        title={t("Editar Usuário")}
        description={t("Tem certeza de que deseja Editar este usuário?")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={editIsLoading}
      />

      <ModalForm
        isOpen={isEditPasswordModalOpen}
        onClose={onEditPasswordModalClose}
        form={
          <EditUsersPasswordForm
            formRef={formRef}
            onEdit={changePassword}
            onCloseModal={onEditPasswordModalClose}
          />
        }
        formRef={formRef}
        title={t("Editar Senha")}
        description={t("Tem certeza que deseja alterar a senha?")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={changePasswordIsLoading}
      />

      <ModalForm
        isOpen={isAddUserModalOpen}
        onClose={onAddUserModalClose}
        form={
          <AddUserForm formRef={formRef} onCloseModal={onAddUserModalClose} />
        }
        formRef={formRef}
        title={t("Adicionar usuário")}
        description={""}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={createUserIsLoading}
      />

      <DeleteModal
        title={t("Excluir Usuário")}
        subtitle={t("Tem certeza de que deseja excluir este usuário?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          await deleteUser(deleteId.id);
          onDeleteModalClose();
        }}
        id={deleteId}
        isLoading={deleteIsLoading}
      />

      <DeleteModal
        title={t("Excluir Usuários")}
        subtitle={t("Tem certeza de que deseja excluir estes usuários?")}
        isOpen={isDeleteSelectedUsers}
        onClose={onDeleteSelectedUsersClose}
        id={selectedItems}
        onConfirm={onConfirmDeleteSelecteds}
        isLoading={selectedIsLoading}
      />
    </Wrapper>
  );
};

export default UsersPage;
