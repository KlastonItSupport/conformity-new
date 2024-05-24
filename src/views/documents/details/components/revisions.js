import {
  Container,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import {
  RevisionsForm,
  ModalForm,
  DeleteModal,
  CustomTable,
} from "components/components";
import { sleep } from "helpers/sleep";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Revisions = () => {
  const { t } = useTranslation();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const formRef = useRef(null);
  const formRefAdd = useRef(null);

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
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const onDeleteClick = (item) => {
    onDeleteModalOpen();
  };

  const onEditClick = (item) => {
    onEditModalOpen();
  };

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <NotePencil size={20} />,
      onClickRow: (e) => onEditClick(e),
      onClickHeader: () => [],
      isDisabled: false,
      shouldShow: false,
    },
    {
      icon: <Trash size={20} />,
      onClickRow: (e) => onDeleteClick(e),
      onClickHeader: (selecteds) => {},
      isDisabled: false,
      shouldShow: true,
    },
  ]);

  return (
    <>
      <VStack
        bgColor={"#FFFFFF"}
        marginInlineStart={0}
        p={"25px"}
        border={"1px solid #ddd"}
        alignItems={"start"}
        mt={"20px"}
      >
        <HStack
          justifyContent={"space-between"}
          w={"100%"}
          color={"#0075df"}
          cursor={"pointer"}
        >
          <Text fontSize={"20px"} color={"header.100"}></Text>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            mb="24px"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            type="submit"
            label={"Adicionar"}
            onClick={onAddModalOpen}
            width="100px"
            padding={"5px"}
            h="40px"
          />
        </HStack>
        <Container w={"100%"} maxW={"null"} p={"0px"} overflow={"hidden"}>
          <CustomTable
            data={[
              {
                id: "529",
                docId: "8570",
                data: "23/05/2024	",
                description: "Isso é um teste",
                userId: "5384",
              },
            ]}
            columns={[
              { header: t("Código"), access: "id" },
              { header: t("Código Documento"), access: "docId" },
              { header: "Dados", access: "data" },
              { header: t("Descrição"), access: "description" },
              { header: t("Usuário"), access: "userId" },
            ]}
            title={t("Revisões")}
            actionButtons={[
              <NotePencil size={20} cursor={"pointer"} color="black" />,
              <Trash size={20} cursor={"pointer"} color="black" />,
            ]}
            icons={tableIcons}
            onChangeSearchInput={(e) => {}}
            searchInputValue={() => {}}
            onCheckItems={(show) => {}}
            paddingOnTitle={false}
            showSearchInput={false}
            hasMinHg={false}
          />
        </Container>
      </VStack>
      <DeleteModal
        title={t("Excluir Revisão")}
        subtitle={t("Tem certeza de que deseja excluir esta Revisão?")}
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

      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        id={"editId"}
        form={<RevisionsForm formRef={formRef} onClose={onEditModalClose} />}
        formRef={formRef}
        title={t("Editar Revisão")}
        description={t("Tem certeza de que deseja Editar esta Revisão?")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isEditLoading}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        id={"editId"}
        form={
          <RevisionsForm
            formRef={formRefAdd}
            onClose={onAddModalClose}
            event={"add"}
          />
        }
        formRef={formRefAdd}
        title={t("Adicionar Revisão")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
      />
    </>
  );
};

export default Revisions;
