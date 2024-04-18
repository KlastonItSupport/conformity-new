import { useRef, useState } from "react";
import { Box, Flex, VStack, useDisclosure } from "@chakra-ui/react";
import { AuthContext } from "providers/auth";
import { useContext, useEffect } from "react";
import { columns } from "./components/table-helper";
import { Key, NotePencil, Trash } from "@phosphor-icons/react";
import { UserContext } from "providers/users";
import { useNavigate, useSearchParams } from "react-router-dom";
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

export const UsersPage = () => {
  const { dealingWithAuth, getUserInfo } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const history = useNavigate();
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
    dealingWithAuth(true, "/users", history);
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
      label: "Usuários",
      isCurrent: true,
    },
  ];

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <Box w={isMobile ? "100vw" : "95vw"} paddingX={isMobile ? "20px" : 0}>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="50"
            mb="24px"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            type="submit"
            label=" + Adicionar"
            width="150px"
            onClick={onAddUserModalOpen}
          />
        </Box>
        <CustomTable
          data={users}
          columns={columns}
          title={"Usuários"}
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
        <Flex
          justifyContent={"end"}
          w={isMobile ? "99vw" : "95vw"}
          bgColor={"white"}
        >
          {pagination && (
            <Pagination
              data={users}
              onClickPagination={updateData}
              itemsPerPage={itemsPerPage}
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              nextPage={pagination.next}
              lastPage={pagination.last}
            />
          )}
        </Flex>

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
          title={"Editar Usuário"}
          description={"Tem certeza de que deseja Editar este usuário?"}
          leftButtonLabel={"Cancelar"}
          rightButtonLabel={"Editar"}
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
          title={"Editar Senha"}
          description={"Tem certeza que deseja alterar a senha?"}
          leftButtonLabel={"Cancelar"}
          rightButtonLabel={"Editar"}
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
          title={"Adicionar usuário"}
          description={""}
          leftButtonLabel={"Cancelar"}
          rightButtonLabel={"Criar"}
          isLoading={createUserIsLoading}
        />
        <DeleteModal
          title={"Excluir Usuário"}
          subtitle={"Tem certeza de que deseja excluir este usuário?"}
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
          title={"Excluir Usuários"}
          subtitle={"Tem certeza de que deseja excluir estes usuários?"}
          isOpen={isDeleteSelectedUsers}
          onClose={onDeleteSelectedUsersClose}
          id={selectedItems}
          onConfirm={onConfirmDeleteSelecteds}
          isLoading={selectedIsLoading}
        />
      </VStack>
    </>
  );
};
