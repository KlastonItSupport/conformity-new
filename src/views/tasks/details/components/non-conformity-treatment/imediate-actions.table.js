// Data (Prazo)	Responsável	Ação
import { CustomTable } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import moment from "moment-timezone";

import { NotePencil, Trash } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@chakra-ui/react";
import { ModalForm } from "components/components";
import ImediateActionsForm from "./forms/imediate-actions-form";
import { DeleteModal } from "components/components";
import { api } from "api/api";
import { toast } from "react-toastify";
import { AuthContext } from "providers/auth";

export const columns = [
  {
    header: "Data (Prazo)",
    access: "date",
    formatData: (data) => {
      return moment.utc(data).format("DD/MM/YYYY");
    },
  },
  {
    header: "Responsável",
    access: "responsable",
  },
  {
    header: "Ação",
    access: "action",
  },
];

const ImediateActionsTable = ({
  canDelete,
  canEdit,
  canAdd,
  taskId,
  immediateActions,
  setImmediateActions,
}) => {
  const [tableIcons, setTableIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(null);
  const [editSelected, setEditSelected] = useState(null);
  const [isShowing, setIsShowing] = useState(false);
  const { getToken } = useContext(AuthContext);
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

  const onAdd = async (data) => {
    const res = await api.post(
      `tasks-details/immediate-actions`,
      {
        ...data,
        taskId,
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (res.status === 201) {
      toast.success("Ação imediata criada com sucesso!");
      setImmediateActions([...immediateActions, res.data]);
    }
  };

  const onEdit = async (data) => {
    const res = await api.patch(
      `tasks-details/immediate-actions/${editSelected.id}`,
      data
    );

    if (res.status === 200) {
      toast.success("Ação imediata atualizada com sucesso!");
      const immediateActionsCopy = [...immediateActions];
      const index = immediateActionsCopy.findIndex(
        (item) => item.id === editSelected.id
      );
      immediateActionsCopy[index] = { ...res.data };
      setImmediateActions(immediateActionsCopy);
    }
  };

  const deleteItem = async (id) => {
    const res = await api.delete(`tasks-details/immediate-actions/${id}`);

    if (res.status === 200) {
      toast.success("Ação imediata excluída com sucesso!");
      setImmediateActions([
        ...immediateActions.filter((item) => item.id !== id),
      ]);
    }
  };

  const deleteMultiple = async (selected) => {
    const idsToDelete = selected
      .filter((item) => item.id !== "checkall")
      .map((item) => item.id);

    await Promise.all(idsToDelete.map(async (id) => await deleteItem(id)));

    setImmediateActions((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canDelete, canEdit]);

  useEffect(() => {
    if (immediateActions.length > 0) {
      setIsShowing(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imeadiateActionsTable = (
    <CustomTable
      data={immediateActions}
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
        title={"Ações Imediatas:"}
        table={imeadiateActionsTable}
        columns={columns}
        onAdd={onAddModalOpen}
        canAdd={canAdd}
        isShowing={isShowing}
        setIsShowing={setIsShowing}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <ImediateActionsForm
            formRef={formRef}
            onClose={onAddModalClose}
            setIsLoading={setIsLoading}
            onAdd={onAdd}
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
          <ImediateActionsForm
            formRef={formRef}
            onClose={onEditModalClose}
            setIsLoading={setIsLoading}
            event="edit"
            onEdit={onEdit}
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
        title={t("Excluir Ação imediata")}
        subtitle={t("Tem certeza de que deseja excluir esta ação imediata?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);
          await deleteItem(deleteSelected.id);
          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />

      <DeleteModal
        title={t("Excluir Ação imediata")}
        subtitle={t("Tem certeza de que deseja excluir estas ações imediatas?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsLoading(true);
          await deleteMultiple(selected);
          setIsLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default ImediateActionsTable;
