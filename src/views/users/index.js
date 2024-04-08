import { useRef, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AuthContext } from "providers/auth";
import { useContext, useEffect } from "react";
import CustomTable from "../../components/customTable";
import { columns, usersMock } from "./components/usersarray";
import { Pagination } from "../../components/pagination/pagination";
import { Key, NotePencil, Trash } from "@phosphor-icons/react";
import DeleteModal from "components/modals/deleteModal";
import { ButtonPrimary } from "components/button-primary";
import { EditUsersForm } from "components/forms/users/editUsers/editUsers";
import { EditUsersPasswordForm } from "components/forms/users/editUsers/editPassword";
import NavigationLinks from "components/navigationLinks";
import { UserContext } from "providers/users";
import { ModalForm } from "components/modals/modalForm";
import { AddUserForm } from "components/forms/users/addUser/addUser";
import { NavBar } from "components/navbar";

export const UsersPage = () => {
  const { dealingWithAuth } = useContext(AuthContext);
  const itemsPerPage = 10;
  const {
    deleteId,
    changeDeleteId,
    editId,
    changeEditId,
    users,
    changeUsers,
    selectedItems,
  } = useContext(UserContext);

  const formRef = useRef(null);

  useEffect(() => {
    // dealingWithAuth(true, "/users", history);
    updateData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = (page) => {
    const firstPostIndex = (page - 1) * itemsPerPage;
    const lastItemIndex = firstPostIndex + itemsPerPage;
    const slicedData = usersMock.slice(firstPostIndex, lastItemIndex);

    changeUsers([...slicedData]);
  };
  const isMobile = useBreakpointValue({
    base: false,
    md: false,
    lg: false,
    sm: true,
  });

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
    changeEditId(item);
    onEditModalOpen();
  };

  const handleDeleteModalOpen = (item) => {
    changeDeleteId(item);
    onDeleteModalOpen();
  };

  const handleOnDeleteSelectedUsersOpen = (selecteds) => {
    onDeleteSelectedUsersOpen();
  };

  const handlePasswordChangeModalOpen = (id) => {
    onEditPasswordModalOpen();
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
      onClickHeader: handleOnDeleteSelectedUsersOpen,
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
      <VStack marginTop={"40px"} spacing={0} w="100%" h="100%">
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
          <Pagination
            data={usersMock}
            onClickPagination={updateData}
            itemsPerPage={itemsPerPage}
          />
        </Flex>

        <ModalForm
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          id={editId}
          form={<EditUsersForm formRef={formRef} />}
          formRef={formRef}
          title={"Editar Usuário"}
          description={"Tem certeza de que deseja Editar este usuário?"}
          leftButtonLabel={"Cancelar"}
          rightButtonLabel={"Editar"}
          modalSize="xl"
        />

        <ModalForm
          isOpen={isEditPasswordModalOpen}
          onClose={onEditPasswordModalClose}
          id={editId}
          form={<EditUsersPasswordForm formRef={formRef} />}
          formRef={formRef}
          title={"Editar Senha"}
          description={"Tem certeza que deseja alterar a senha?"}
          leftButtonLabel={"Cancelar"}
          rightButtonLabel={"Editar"}
          modalSize="xl"
        />

        <ModalForm
          isOpen={isAddUserModalOpen}
          onClose={onAddUserModalClose}
          id={editId}
          form={<AddUserForm formRef={formRef} />}
          formRef={formRef}
          title={"Adicionar usuário"}
          description={""}
          leftButtonLabel={"Cancelar"}
          rightButtonLabel={"Editar"}
        />
        <DeleteModal
          title={"Excluir Usuário"}
          subtitle={"Tem certeza de que deseja excluir este usuário?"}
          isOpen={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          id={deleteId}
        />
        <DeleteModal
          title={"Excluir Usuários"}
          subtitle={"Tem certeza de que deseja excluir estes usuários?"}
          isOpen={isDeleteSelectedUsers}
          onClose={onDeleteSelectedUsersClose}
          id={selectedItems}
        />
      </VStack>
    </>
  );
};
