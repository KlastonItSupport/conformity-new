import { CustomTable } from "components/components";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import ToggleArrow from "../toggle-arrow";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { useDisclosure, VStack } from "@chakra-ui/react";
import { ModalForm } from "components/components";
import CustomRootCauseForm from "./forms/custom-root-cause-form";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";
import { api } from "api/api";
import { toast } from "react-toastify";
import { AuthContext } from "providers/auth";
import { use } from "i18next";

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

const CustomRootCausesTable = ({
  canDelete,
  canEdit,
  canAdd,
  taskId,
  customRootCauses,
  setCustomRootCauses,
}) => {
  const formRef = useRef(null);
  const { t } = useTranslation();
  const [tableIcons, setTableIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState(false);
  const [editSelected, setEditSelected] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [selected, setSelected] = useState([]);
  const { getToken } = useContext(AuthContext);

  const onDelete = async (id) => {
    const res = await api.delete(`tasks-details/root-cause-analysis/${id}`);

    if (res.status === 200) {
      toast.success("Análise de causa raiz excluída com sucesso!");
      setCustomRootCauses([
        ...customRootCauses.filter((item) => item.id !== id),
      ]);
    }
  };

  const deleteMultiple = async (selected) => {
    const idsToDelete = selected
      .filter((item) => item.id !== "checkall")
      .map((item) => item.id);

    await Promise.all(idsToDelete.map(async (id) => await onDelete(id)));

    setCustomRootCauses((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );
  };

  const onEdit = async (data) => {
    const res = await api.patch(
      `tasks-details/root-cause-analysis/${editSelected.id}`,
      data
    );

    if (res.status === 200) {
      toast.success("Análise de causa raiz atualizada com sucesso!");
      const customRootCausesCopy = [...customRootCauses];
      const index = customRootCausesCopy.findIndex(
        (item) => item.id === editSelected.id
      );
      customRootCausesCopy[index] = { ...res.data };
      setCustomRootCauses(customRootCausesCopy);
    }
  };

  const onAdd = async (data) => {
    const res = await api.post(
      `tasks-details/root-cause-analysis`,
      {
        ...data,
        taskId,
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (res.status === 201) {
      toast.success("Análise de causa raiz criada com sucesso!");
      setCustomRootCauses([...customRootCauses, res.data]);
    }
  };

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
  }, []);
  // }, [userPermissions, userAccessRule]);

  useEffect(() => {
    if (customRootCauses.length > 0) {
      setIsShowing(true);
    }
  }, []);

  const customRootCausesTable = (
    <CustomTable
      data={customRootCauses}
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
          canAdd={canAdd}
          isShowing={isShowing}
          setIsShowing={setIsShowing}
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
          <CustomRootCauseForm
            formRef={formRef}
            onClose={onEditModalClose}
            setIsLoading={setIsLoading}
            formValues={editSelected}
            onEdit={onEdit}
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
        title={t("Excluir Análise de causa raiz")}
        subtitle={t(
          "Tem certeza de que deseja excluir esta Análise de causa raiz?"
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
        title={t("Excluir Análises de causa raiz")}
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

export default CustomRootCausesTable;
