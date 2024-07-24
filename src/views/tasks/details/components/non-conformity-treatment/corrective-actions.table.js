// Data (Prazo)	Responsável	Ação	Resultado
import { CustomTable } from "components/components";
import React, { useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import moment from "moment";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import { useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CorrectiveActionsForm from "./forms/corrective-actions-form";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";

export const mockedData = [
  {
    data: "2022-10-10",
    responsable: "João da Silva",
    action: "Este documento é importante para a nossa equipe",
    result: "Sim",
  },
  {
    data: "2022-10-10",
    responsable: "Bruno Santos",
    action: "Este documento é importante para a nossa equipe",
    result: "Sim",
  },
  {
    data: "2022-10-10",
    responsable: "Maria da Silva",
    action: "Este documento é importante para a nossa equipe",
    result: "Sim",
  },
];

export const columns = [
  {
    header: "Data (Prazo)",
    access: "data",
    formatData: (data) => moment.utc(data).format("DD/MM/YYYY"),
  },
  {
    header: "Responsável",
    access: "responsable",
  },
  {
    header: "Ação",
    access: "action",
  },
  {
    header: "Resultado",
    access: "result",
  },
];

const CorrectiveActionsTable = ({ canDelete, canEdit }) => {
  const [tableIcons, setTableIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(null);
  const [editSelected, setEditSelected] = useState(null);
  const { t } = useTranslation();
  const formRef = useRef(null);

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
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

  const correctiveActionsTable = (
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
        title={"Ações Corretivas:"}
        table={correctiveActionsTable}
        columns={columns}
        onAdd={onAddModalOpen}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <CorrectiveActionsForm
            formRef={formRef}
            onClose={onAddModalClose}
            setIsLoading={setIsLoading}
          />
        }
        formRef={formRef}
        title={t("Adicionar Ação Corretiva")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <CorrectiveActionsForm
            formRef={formRef}
            onClose={onEditModalClose}
            setIsLoading={setIsLoading}
            formValues={editSelected}
          />
        }
        formRef={formRef}
        title={t("Editar Ação Corretiva")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Ação Corretiva")}
        subtitle={t("Tem certeza de que deseja excluir esta ação corretiva?")}
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
        title={t("Excluir Ações Corretivas")}
        subtitle={t(
          "Tem certeza de que deseja excluir estas ações corretivas?"
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

export default CorrectiveActionsTable;
