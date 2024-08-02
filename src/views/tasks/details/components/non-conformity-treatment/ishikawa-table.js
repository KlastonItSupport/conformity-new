import { CustomTable } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@chakra-ui/react";
import IshikawaForm from "./forms/ishikawa-form";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";
import { api } from "api/api";
import { toast } from "react-toastify";
import { AuthContext } from "providers/auth";

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

const IshikawaTable = ({ canDelete, canEdit, canAdd, taskId }) => {
  const [tableIcons, setTableIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [editSelected, setEditSelected] = useState(false);
  const [selected, setSelected] = useState([]);
  const [ishikawa, setIshikawa] = useState([]);
  const { getToken } = useContext(AuthContext);
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

  const getIshikawa = async (id) => {
    const res = await api.get(`tasks-details/ishikawa/${id}`);
    setIshikawa(res.data);
  };

  const deleteItem = async (id) => {
    const res = await api.delete(`tasks-details/ishikawa/${id}`);

    if (res.status === 200) {
      toast.success("Análise de causa raiz excluída com sucesso!");
      setIshikawa([...ishikawa.filter((item) => item.id !== id)]);
    }
  };

  const deleteMultiple = async (selected) => {
    const idsToDelete = selected
      .filter((item) => item.id !== "checkall")
      .map((item) => item.id);

    await Promise.all(idsToDelete.map(async (id) => await deleteItem(id)));

    setIshikawa((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );
  };

  const addIshikawa = async (data) => {
    const res = await api.post(
      `tasks-details/ishikawa`,
      { ...data, taskId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (res.status === 201) {
      toast.success("Análise de causa raiz adicionada com sucesso!");
      setIshikawa([...ishikawa, res.data]);
    }
  };

  const editIshikawa = async (data) => {
    const res = await api.patch(
      `tasks-details/ishikawa/${editSelected.id}`,
      data
    );

    if (res.status === 200) {
      toast.success("Análise de causa raiz atualizada com sucesso!");
      const ishikawaCopy = [...ishikawa];
      const index = ishikawaCopy.findIndex(
        (item) => item.id === editSelected.id
      );
      ishikawaCopy[index] = { ...res.data };
      setIshikawa(ishikawaCopy);
    }
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
  }, [canDelete, canEdit]);

  useEffect(() => {
    getIshikawa(taskId);
  }, []);

  const ishikawaTable = (
    <CustomTable
      data={ishikawa}
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
        canAdd={canAdd}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <IshikawaForm
            formRef={formRef}
            onClose={onAddModalClose}
            setIsLoading={setIsLoading}
            onAdd={addIshikawa}
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
            onEdit={editIshikawa}
            event="edit"
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
          await deleteItem(deleteSelected.id);
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
          await deleteMultiple(selected);
          setIsLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default IshikawaTable;
