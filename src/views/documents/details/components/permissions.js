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
import { sleep } from "helpers/sleep";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const Permissions = () => {
  const { t } = useTranslation();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const onDeleteClick = (item) => {
    onDeleteModalOpen();
  };

  const {
    formState: { errors },
  } = useForm({});

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <Trash size={20} />,
      onClickRow: (e) => onDeleteClick(e),
      onClickHeader: (selecteds) => {},
      isDisabled: false,
      shouldShow: true,
    },
  ]);

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
          data={[
            {
              departamentName: "Tecnologia",
              docId: "Autorizado",
            },
          ]}
          deskWidth={"100%"}
          columns={[
            { header: t("Departamento"), access: "departamentName" },
            { header: t("Autorizado"), access: "authorized" },
          ]}
          title={t("Permissões")}
          actionButtons={[<Trash size={20} cursor={"pointer"} color="black" />]}
          icons={tableIcons}
          onChangeSearchInput={(e) => {}}
          searchInputValue={() => {}}
          onCheckItems={(show) => {}}
          paddingOnTitle={false}
          showSearchInput={false}
          hasMinHg={false}
        />
      </Container>
      <DeleteModal
        title={t("Excluir Permissão")}
        subtitle={t("Tem certeza de que deseja excluir esta permissão?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await sleep(1500);
          setIsDeleteLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isDeleteLoading}
      />
    </VStack>
  );
};

export default Permissions;
