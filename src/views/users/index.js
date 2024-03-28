import { useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AuthContext } from "providers/auth";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckTable from "../../components/customTable";
import { columns, usersMock } from "./components/usersarray";
import { Pagination } from "../../components/pagination/pagination";
import { Key, NotePencil, Trash } from "@phosphor-icons/react";
import DeleteModal from "components/modals/deleteModal";
import { ButtonPrimary } from "components/button-primary";
import EditModal from "components/modals/editModal";
import { EditUsersForm } from "components/forms/users/editUsers/editUsers";
import { EditUsersPasswordForm } from "components/forms/users/editUsers/editPassword";
import NavigationLinks from "components/navigationLinks";
import { UserContext } from "providers/users";

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

  const history = useNavigate();
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
    isOpen: isDeleteSelectedUsers,
    onOpen: onDeleteSelectedUsersOpen,
    onClose: onDeleteSelectedUsersClose,
  } = useDisclosure();

  const handleEditModalOpen = (id) => {
    changeEditId(id);
    onEditModalOpen();
  };

  const handleDeleteModalOpen = (id) => {
    changeDeleteId(id);
    onDeleteModalOpen();
  };

  const handleOnDeleteSelectedUsersClose = () => {
    onDeleteSelectedUsersOpen();
  };

  const handlePasswordChangeModalOpen = (id) => {
    onEditPasswordModalOpen();
  };

  const handleTrainingModalOpen = (id) => {
    // onTrainingModalOpen();
  };

  return (
    <VStack spacing={0} w="100%" h="100%" py={"30px"}>
      <NavigationLinks
        routeTree={[
          {
            path: "/",
            label: "Dashboard",
          },
          {
            path: "/users",
            label: "Usuários",
            isCurrent: true,
          },
        ]}
      />
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
        />
      </Box>
      <CheckTable
        data={users}
        columns={columns}
        title={"Usuários"}
        actionButtons={[
          <NotePencil size={20} cursor={"pointer"} />,
          <Trash size={20} cursor={"pointer"} />,
          <Key size={20} cursor={"pointer"} />,
        ]}
        actionButtonsOnClick={[
          handleEditModalOpen,
          handleDeleteModalOpen,
          handlePasswordChangeModalOpen,
        ]}
        actionButtonsOnClickHeaders={[
          () => {},
          handleOnDeleteSelectedUsersClose,
          () => {},
        ]}
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

      <EditModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        id={editId}
        form={<EditUsersForm formRef={formRef} />}
        formRef={formRef}
        title={"Editar Usuário"}
        description={"Tem certeza de que deseja Editar este usuário?"}
      />

      <EditModal
        isOpen={isEditPasswordModalOpen}
        onClose={onEditPasswordModalClose}
        id={editId}
        form={<EditUsersPasswordForm formRef={formRef} />}
        formRef={formRef}
        title={"Editar Senha"}
        description={"Tem certeza que deseja alterar a senha?"}
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
  );
};
