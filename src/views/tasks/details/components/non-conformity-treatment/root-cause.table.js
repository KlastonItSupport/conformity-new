import { CustomTable } from "components/components";
import React, { useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@chakra-ui/react";
import RootCauseForm from "./forms/root-cause-form";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";

export const mockedData = [
  {
    rootCause: "Causa raiz a ser tratada",
  },
  {
    rootCause: "Tratar causa raiz",
  },
  {
    rootCause: "Análise de causa raiz",
  },
];

export const columns = [
  {
    header: "Causa Raiz",
    access: "rootCause",
  },
];

const RootCauseTable = ({ canDelete, canEdit }) => {
  const [tableIcons, setTableIcons] = useState([]);

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [editSelected, setEditSelected] = useState(false);
  const [selected, setSelected] = useState([]);
  const formRef = useRef(null);

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

  const rootCauseTable = (
    <CustomTable
      data={mockedData}
      columns={columns}
      showSearchInput={false}
      hasMinHg={false}
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
  );
  return (
    <>
      <ToggleArrow
        title={"Causa raiz a ser tratada"}
        table={rootCauseTable}
        columns={columns}
        onAdd={onAddModalOpen}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <RootCauseForm
            formRef={formRef}
            onClose={onAddModalClose}
            setIsLoading={setIsLoading}
          />
        }
        formRef={formRef}
        title={t("Adicionar Causa raiz a ser tratada")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <RootCauseForm
            formRef={formRef}
            onClose={onEditModalClose}
            setIsLoading={setIsLoading}
            formValues={editSelected}
          />
        }
        formRef={formRef}
        title={t("Editar Causa raiz a ser tratada")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Causa raiz a ser tratada")}
        subtitle={t(
          "Tem certeza de que deseja excluir esta Causa raiz a ser tratada?"
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
        title={t("Excluir Causa raiz a ser tratada")}
        subtitle={t(
          "Tem certeza de que deseja excluir estas Causas a serem tratadas?"
        )}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsLoading(true);
          await sleep(200);
          // await onDelete(id);
          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default RootCauseTable;
