import { CustomTable } from "components/components";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { useDisclosure, VStack } from "@chakra-ui/react";
import { ModalForm } from "components/components";
import CustomRootCauseForm from "./forms/custom-root-cause-form";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";

export const mockedData = [
  {
    responsable: "João da Silva",
    why: "Este documento é importante para a nossa equipe",
    answer: "Sim",
    date: "2022-10-10",
  },
  {
    responsable: "Bruno Santos",
    why: "Este documento é importante para a nossa equipe",
    answer: "Sim",
    date: "2022-10-10",
  },
  {
    responsable: "Maria da Silva",
    why: "Este documento é importante para a nossa equipe",
    answer: "Sim",
    date: "2022-10-10",
  },
];

export const columns = [
  {
    header: "Responsável",
    access: "responsable",
  },
  {
    header: "Por que?",
    access: "why",
  },
  {
    header: "Resposta?",
    access: "answer",
  },
  {
    header: "Data",
    access: "date",
    formatData: (data) => moment.utc(data).format("DD/MM/YYYY"),
  },
];

const CustomRootCausesTable = ({ canDelete, canEdit }) => {
  const formRef = useRef(null);
  const { t } = useTranslation();
  const [tableIcons, setTableIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [editSelected, setEditSelected] = useState(false);
  const [selected, setSelected] = useState([]);

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

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

  useEffect(() => {
    const updateIcons = () => {
      const deleteIcon = canDelete
        ? {
            icon: <Trash size={20} />,
            onClickRow: (item) => {
              setDeleteSelected(item);
              onDeleteModalOpen();
            },
            onClickHeader: (selecteds) => {
              setSelected(selecteds);
              onDeleteMultipleModalOpen();
            },
            isDisabled: false,
            shouldShow: true,
          }
        : null;

      const editIcon = canEdit
        ? {
            icon: <NotePencil size={20} />,
            onClickRow: (item) => {
              setEditSelected(item);
              onEditModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
          }
        : null;

      const icons = [deleteIcon, editIcon].filter((icon) => icon !== null);

      setTableIcons(icons);
    };

    updateIcons();
  }, [canDelete, canEdit]);

  const customRootCausesTable = (
    <CustomTable
      data={mockedData}
      columns={columns}
      showSearchInput={false}
      icons={tableIcons}
      onCheckItems={(show) => {
        setTableIcons(
          tableIcons.map((icon) => {
            icon.isDisabled = show;
            return icon;
          })
        );
      }}
      hasMinHg={false}
      cellPadding={"10px"}
    />
  );
  return (
    <>
      <VStack w={"100%"} alignItems={"start"}>
        <ToggleArrow
          title={"Análise de causa raiz (5 whys):"}
          table={customRootCausesTable}
          columns={columns}
          onAdd={onAddModalOpen}
        />
      </VStack>
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <CustomRootCauseForm
            formRef={formRef}
            onClose={onAddModalClose}
            setIsLoading={setIsLoading}
          />
        }
        formRef={formRef}
        title={t("Adicionar ação imediata")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <CustomRootCauseForm
            formRef={formRef}
            onClose={onEditModalClose}
            setIsLoading={setIsLoading}
            formValues={editSelected}
          />
        }
        formRef={formRef}
        title={t("Editar ação imediata")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Análise de causa raiz")}
        subtitle={t(
          "Tem certeza de que deseja excluir esta Análise de causa raiz?"
        )}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);
          await sleep(200);
          // await onDelete(id);
          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />

      <DeleteModal
        title={t("Excluir Análise de causa raiz")}
        subtitle={t(
          "Tem certeza de que deseja excluir estas Análises de causa raiz?"
        )}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsLoading(true);
          await sleep(200);
          setIsLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default CustomRootCausesTable;
