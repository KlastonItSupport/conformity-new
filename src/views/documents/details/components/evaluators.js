import {
  Container,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Trash } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import { AddEvaluatorForm } from "components/components";
import { DeleteModal } from "components/components";
import { CustomTable } from "components/components";
import { sleep } from "helpers/sleep";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Evaluators = () => {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

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

  const onDeleteClick = (item) => {
    onDeleteModalOpen();
  };

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
    >
      <HStack
        justifyContent={"space-between"}
        w={"100%"}
        color={"#0075df"}
        cursor={"pointer"}
      >
        <Text fontSize={"20px"} color={"header.100"}></Text>
        <HStack>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            type="submit"
            label={"Adicionar"}
            onClick={onEditModalOpen}
            width="100px"
            padding={"5px"}
            h="40px"
          />
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
            label={"Reenviar e-mails"}
            width="140px"
            padding={"5px"}
            h="40px"
          />
        </HStack>
      </HStack>
      <Container w={"100%"} maxW={"null"} p={"0px"}>
        <CustomTable
          data={[
            {
              name: "Gustavo Santos",
              cancelDescription: "Cancelado por taltaltaltaltlattl",
              reviewed: "PENDENTE",
              approved: "PENDENTE",
              edited: "SIM",
              delete: "SIM",
            },
          ]}
          columns={[
            { header: t("Nome"), access: "name" },
            {
              header: t("Descrição do cancelamento"),
              access: "cancelDescription",
            },
            { header: "Revisado", access: "reviewed" },
            { header: t("Aprovado?"), access: "approved" },
            { header: t("Editar?"), access: "edited" },
            { header: t("Deletar?"), access: "delete" },
          ]}
          title={t("Avaliações")}
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
        title={t("Excluir Feed")}
        subtitle={t("Tem certeza de que deseja excluir este item do Feed?")}
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
        form={<AddEvaluatorForm formRef={formRef} onClose={onEditModalClose} />}
        formRef={formRef}
        title={t("Adicionar Avaliador / Gestor")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
      />
    </VStack>
  );
};

export default Evaluators;
