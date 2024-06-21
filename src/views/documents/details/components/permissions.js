import {
  Container,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Trash } from "@phosphor-icons/react";
import { DeleteModal } from "components/components";
import { CustomTable } from "components/components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  columns,
  removeDepartamentsPermissions,
  removeMultipleDepartamentsPermissions,
} from "../helpers/departament-permissions-helper";

const Permissions = ({
  departamentsPermissions,
  setDepartamentsPermissions,
}) => {
  const { t } = useTranslation();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [selecteds, setSelecteds] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);

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

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <Trash size={20} />,
      onClickRow: (e) => onDeleteClick(e.id),
      onClickHeader: (selecteds) => {
        setSelecteds(selecteds);
        onDeleteMultipleModalOpen();
      },
      isDisabled: false,
      shouldShow: true,
    },
  ]);
  const onDeleteClick = async (item) => {
    onDeleteModalOpen();
    setDeleteItem(item);
  };

  return (
    <VStack
      bgColor={"#FFFFFF"}
      marginInlineStart={0}
      p={"25px"}
      border={"1px solid #ddd"}
      alignItems={"start"}
      mt={"20px"}
      w={"100%"}
    >
      <HStack
        justifyContent={"space-between"}
        w={"100%"}
        color={"#0075df"}
        cursor={"pointer"}
      >
        <Text fontSize={"20px"} color={"header.100"}></Text>
      </HStack>
      <Container w={"100%"} maxW={"null"} p={"0px"}>
        <CustomTable
          data={departamentsPermissions}
          deskWidth={"100%"}
          columns={columns}
          title={t("Permissões")}
          actionButtons={[<Trash size={20} cursor={"pointer"} color="black" />]}
          icons={tableIcons}
          onChangeSearchInput={(e) => {}}
          searchInputValue={() => {}}
          paddingOnTitle={false}
          showSearchInput={false}
          hasMinHg={false}
          onCheckItems={(show) => {
            setTableIcons(
              tableIcons.map((icon) => {
                icon.isDisabled = show;
                return icon;
              })
            );
          }}
        />
      </Container>
      <DeleteModal
        title={t("Excluir Permissão")}
        subtitle={t("Tem certeza de que deseja excluir esta permissão?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await removeDepartamentsPermissions(
            deleteItem,
            departamentsPermissions,
            setDepartamentsPermissions
          );
          setIsDeleteLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <DeleteModal
        title={t("Excluir Permissoes")}
        subtitle={t("Tem certeza de que deseja excluir estas permissoes?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await removeMultipleDepartamentsPermissions(
            selecteds,
            departamentsPermissions,
            setDepartamentsPermissions
          );
          setIsDeleteLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />
    </VStack>
  );
};

export default Permissions;
