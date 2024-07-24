import { CustomTable } from "components/components";
import React, { useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@chakra-ui/react";
import IshikawaForm from "./forms/ishikawa-form";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";

export const mockedData = [
  {
    responsable: "João da Silva",
    method: "Este documento é importante para a nossa equipe",
    workHand: "Não",
    measure: "Medida",
    environment: "Meio amb",
    machine: "Maq",
    material: "Sim",
  },
  {
    responsable: "Bruno Santos",
    method: "Este documento é importante para a nossa equipe",
    workHand: "Sim",
    measure: "Sim",
    environment: "Sim",
    machine: "Sim",
    material: "Sim",
  },
  {
    responsable: "Maria da Silva",
    method: "Este documento é importante para a nossa equipe",
    workHand: "Sim",
    measure: "Sim",
    environment: "Sim",
    machine: "Sim",
    material: "Sim",
  },
];

export const columns = [
  {
    header: "Responsável",
    access: "responsable",
  },
  {
    header: "Método",
    access: "method",
  },
  {
    header: "Máquina",
    access: "machine",
  },
  {
    header: "Material",
    access: "material",
    // formatData: (data) => moment.utc(data).format("DD/MM/YYYY"),
  },
  {
    header: "Mão de obra",
    access: "workHand",
  },
  {
    header: "Medida",
    access: "measure",
  },
  {
    header: "Meio ambiente",
    access: "environment",
  },
];

const IshikawaTable = ({ canDelete, canEdit }) => {
  const [tableIcons, setTableIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [editSelected, setEditSelected] = useState(false);
  const [selected, setSelected] = useState([]);
  const formRef = useRef(null);
  const { t } = useTranslation();

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

  const ishikawaTable = (
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
      <ToggleArrow
        title={"Análise de causa raiz (Ishikawa):"}
        table={ishikawaTable}
        columns={columns}
        onAdd={onAddModalOpen}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <IshikawaForm
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
          <IshikawaForm
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
        title={t("Excluir Análise de causa raiz (Ishikawa)")}
        subtitle={t(
          "Tem certeza de que deseja excluir esta Análise de causa raiz (Ishikawa)?"
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

export default IshikawaTable;
