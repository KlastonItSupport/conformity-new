import { CustomTable } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@chakra-ui/react";
import RootCauseForm from "./forms/root-cause-form";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";
import { api } from "api/api";
import { toast } from "react-toastify";
import { AuthContext } from "providers/auth";
import { AUDIT_EVENTS } from "constants/audit-events";

export const columns = [
  {
    header: "Causa Raiz",
    access: "rootCause",
  },
];

const RootCauseTable = ({
  canDelete,
  canEdit,
  canAdd,
  taskId,
  rootCauses,
  setRootCauses,
}) => {
  const [tableIcons, setTableIcons] = useState([]);

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [editSelected, setEditSelected] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [selected, setSelected] = useState([]);
  const { getToken } = useContext(AuthContext);
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

  const onAdd = async (data) => {
    const res = await api.post(
      `tasks-details/root-cause`,
      {
        ...data,
        taskId,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_ROOT_CAUSE_CREATED,
        },
      }
    );

    if (res.status === 201) {
      toast.success("Análise de causa raiz criada com sucesso!");
      setRootCauses([...rootCauses, res.data]);
    }
  };

  const onDelete = async (id) => {
    const res = await api.delete(`tasks-details/root-cause/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_ROOT_CAUSE_DELETED,
      },
    });

    if (res.status === 200) {
      toast.success("Análise de causa raiz excluída com sucesso!");
      setRootCauses([...rootCauses.filter((item) => item.id !== id)]);
    }
  };

  const onEdit = async (data) => {
    const res = await api.patch(
      `tasks-details/root-cause/${editSelected.id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_ROOT_CAUSE_UPDATED,
        },
      }
    );

    if (res.status === 200) {
      toast.success("Análise de causa raiz atualizada com sucesso!");
      const rootCausesCopy = [...rootCauses];
      const index = rootCausesCopy.findIndex(
        (item) => item.id === editSelected.id
      );
      rootCausesCopy[index] = { ...res.data };
      setRootCauses(rootCausesCopy);
    }
  };

  const deleteMultiple = async (selected) => {
    const idsToDelete = selected
      .filter((item) => item.id !== "checkall")
      .map((item) => item.id);

    await Promise.all(idsToDelete.map(async (id) => await onDelete(id)));

    setRootCauses((prev) =>
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
    if (rootCauses.length > 0) {
      setIsShowing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const rootCauseTable = (
    <CustomTable
      data={rootCauses}
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
        canAdd={canAdd}
        isShowing={isShowing}
        setIsShowing={setIsShowing}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <RootCauseForm
            formRef={formRef}
            onClose={onAddModalClose}
            setIsLoading={setIsLoading}
            onAdd={onAdd}
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
            onEdit={onEdit}
            event="edit"
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
          await onDelete(deleteSelected.id);
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
          await deleteMultiple(selected);
          setIsLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default RootCauseTable;
