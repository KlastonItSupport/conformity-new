// Data (Prazo)	Responsável	Ação	Resultado
import { CustomTable } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import moment from "moment";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import { useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CorrectiveActionsForm from "./forms/corrective-actions-form";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";
import { api } from "api/api";
import { toast } from "react-toastify";
import { AuthContext } from "providers/auth";

export const columns = [
  {
    header: "Data (Prazo)",
    access: "date",
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

const CorrectiveActionsTable = ({
  canDelete,
  canEdit,
  canAdd,
  taskId,
  correctiveActions,
  setCorrectiveActions,
}) => {
  const [tableIcons, setTableIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(null);
  const { getToken } = useContext(AuthContext);
  const [editSelected, setEditSelected] = useState(null);
  const [isShowing, setIsShowing] = useState(false);
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

  const deleteCorrectiveAction = async (id) => {
    const res = await api.delete(`tasks-details/corrective-actions/${id}`);

    if (res.status === 200) {
      toast.success("Ação corretiva excluída com sucesso!");
      setCorrectiveActions([
        ...correctiveActions.filter((item) => item.id !== id),
      ]);
    }
  };

  const addCorrectiveAction = async (data) => {
    const res = await api.post(
      `tasks-details/corrective-actions`,
      { ...data, taskId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (res.status === 201) {
      toast.success("Ação corretiva adicionada com sucesso!");
      setCorrectiveActions([...correctiveActions, res.data]);
    }
  };

  const editCorrectiveAction = async (data) => {
    const res = await api.patch(
      `tasks-details/corrective-actions/${editSelected.id}`,
      data
    );

    if (res.status === 200) {
      toast.success("Ação corretiva atualizada com sucesso!");
      const correctiveActionsCopy = [...correctiveActions];
      const index = correctiveActionsCopy.findIndex(
        (item) => item.id === editSelected.id
      );
      correctiveActionsCopy[index] = { ...res.data };
      setCorrectiveActions(correctiveActionsCopy);
    }
  };

  const deleteMultiple = async (selected) => {
    const idsToDelete = selected
      .filter((item) => item.id !== "checkall")
      .map((item) => item.id);

    await Promise.all(
      idsToDelete.map(async (id) => await deleteCorrectiveAction(id))
    );

    setCorrectiveActions((prev) =>
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
    if (correctiveActions.length > 0) {
      setIsShowing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const correctiveActionsTable = (
    <CustomTable
      data={correctiveActions}
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
        canAdd={canAdd}
        isShowing={isShowing}
        setIsShowing={setIsShowing}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <CorrectiveActionsForm
            formRef={formRef}
            onClose={onAddModalClose}
            onAdd={addCorrectiveAction}
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
            onEdit={editCorrectiveAction}
            event="edit"
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
          await deleteCorrectiveAction(deleteSelected.id);
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
          await deleteMultiple(selected);
          setIsLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default CorrectiveActionsTable;
