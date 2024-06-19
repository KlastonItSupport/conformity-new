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
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createEvaluator,
  deleteEvaluator,
  deleteMultipleEvaluators,
  getEvaluators,
} from "../helpers/evaluators-helper";
import { columns } from "../helpers/evaluators-helper";

const Evaluators = ({ documentId }) => {
  const { t } = useTranslation();
  const formRef = useRef(null);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isMultipleLoading, setIsMultipleLoading] = useState(false);
  const [evaluators, setEvaluators] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

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

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <Trash size={20} />,
      onClickRow: (e) => onDeleteClick(e),
      onClickHeader: (selecteds) => {
        setSelectedItems(selecteds);
        onDeleteMultipleModalOpen();
      },
      isDisabled: false,
      shouldShow: true,
    },
  ]);

  const onDeleteClick = (item) => {
    onDeleteModalOpen();
    setDeleteId(item.id);
  };

  useEffect(() => {
    if (evaluators.length === 0) {
      getEvaluators(setEvaluators, documentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          data={evaluators}
          columns={columns}
          title={t("Avaliações")}
          actionButtons={[<Trash size={20} cursor={"pointer"} color="black" />]}
          icons={tableIcons}
          onCheckItems={(show) => {
            setTableIcons(
              tableIcons.map((icon) => {
                icon.isDisabled = show;
                return icon;
              })
            );
          }}
          paddingOnTitle={false}
          showSearchInput={false}
          hasMinHg={false}
        />
      </Container>
      <DeleteModal
        title={t("Excluir Avaliação")}
        subtitle={t("Tem certeza de que deseja excluir esta avaliação")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteEvaluator(setEvaluators, evaluators, deleteId);
          setIsDeleteLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <AddEvaluatorForm
            formRef={formRef}
            onClose={onEditModalClose}
            onAddEvaluator={(data) =>
              createEvaluator(setEvaluators, evaluators, documentId, data)
            }
            documentId={documentId}
          />
        }
        formRef={formRef}
        title={t("Adicionar Avaliador / Gestor")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
      />
      <DeleteModal
        title={t("Excluir Avaliações")}
        subtitle={t("Tem certeza de que deseja excluir estas avaliações?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={() =>
          deleteMultipleEvaluators(
            selectedItems,
            evaluators,
            setEvaluators,
            onDeleteMultipleModalClose,
            setIsMultipleLoading
          )
        }
        isLoading={isMultipleLoading}
      />
    </VStack>
  );
};

export default Evaluators;
