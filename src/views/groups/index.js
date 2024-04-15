import {
  Box,
  Flex,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import React, { useContext, useEffect, useRef, useState } from "react";
import CustomTable from "../../components/customTable";
import { columns, formatOnDownLoad, groupsMock } from "./table-helper";
import { Trash, NotePencil } from "@phosphor-icons/react";
import { ModalForm } from "components/modals/modalForm";
import DeleteModal from "components/modals/deleteModal";
import { GroupForm } from "components/forms/groups/group";
import { GroupContext } from "providers/group";
import { Pagination } from "components/pagination/pagination";

export const GroupsPage = () => {
  const formRef = useRef(null);

  const {
    groups,
    itemsPerPage,
    changeGroup,
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
  } = useContext(GroupContext);

  const isMobile = useBreakpointValue({
    base: false,
    md: false,
    lg: false,
    sm: true,
  });

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

  const onDeleteModalConfirm = () => {
    deleteGroup(deleteId);
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
    const firstPostIndex = (page - 1) * itemsPerPage;
    const lastItemIndex = firstPostIndex + itemsPerPage;
    const slicedData = groupsMock.slice(firstPostIndex, lastItemIndex);

    changeGroup([...slicedData]);
  };

  useEffect(() => {
    const fetchData = async () => {
      getGroups();
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            onClick={onAddGroupModalOpen}
          />
        </Box>
        <CustomTable
          data={groups}
          columns={columns}
          title={"Grupos"}
          icons={tableIcons}
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
        <Flex
          justifyContent={"end"}
          w={isMobile ? "99vw" : "95vw"}
          bgColor={"white"}
        >
          <Pagination
            data={groupsMock}
            onClickPagination={updateData}
            itemsPerPage={itemsPerPage}
          />
        </Flex>
      </VStack>
      <ModalForm
        isOpen={isAddGroupModalOpen}
        onClose={onAddGroupModalClose}
        id={""}
        form={
          <GroupForm formRef={formRef} onCloseModal={onAddGroupModalClose} />
        }
        formRef={formRef}
        title={"Adicionar Grupo"}
        description={""}
        leftButtonLabel={"Cancelar"}
        rightButtonLabel={"Criar"}
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
        title={"Editar Grupo"}
        description={"Tem certeza de que deseja Editar este Grupo?"}
        leftButtonLabel={"Cancelar"}
        rightButtonLabel={"Editar"}
        modalSize="xl"
        isLoading={selectedIsLoading}
      />
      <DeleteModal
        title={"Excluir Grupo"}
        subtitle={"Tem certeza de que deseja excluir este Grupo?"}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={onDeleteModalConfirm}
      />
      <DeleteModal
        title={"Excluir Grupo"}
        subtitle={"Tem certeza de que deseja excluir estes Grupos?"}
        isOpen={isDeleteSelectedGroups}
        onClose={onDeleteSelectedGroupsClose}
        onConfirm={onConfirmDeleteSelecteds}
      />
      ;
    </>
  );
};
