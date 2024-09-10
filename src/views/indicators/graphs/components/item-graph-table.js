import { Box, useDisclosure } from "@chakra-ui/react";
import { NotePencil, Plus, Trash } from "@phosphor-icons/react";
import { DeleteModal } from "components/components";
import { ModalForm } from "components/components";
import { CustomTable } from "components/components";
import TaskForm from "components/forms/tasks/task-form";
import { sleep } from "helpers/sleep";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import { IndicatorsAnswerContext } from "providers/indicator-answer";
import { TasksContext } from "providers/tasks";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import GraphItemForm from "views/indicators/graph-items/graph-item.form";
import { columns } from "views/indicators/graph-items/table-helper";

const ItemGraphTable = ({ indicatorsAnswers }) => {
  const { t } = useTranslation();
  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);
  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);

  const {
    editIndicatorAnswer,
    deleteIndicatorAnswer,
    deleteMultipleIndicatorsAnswers,
    updateTasksColumn,
  } = useContext(IndicatorsAnswerContext);

  const {
    origins,
    setOrigins,
    classifications,
    setClassifications,
    types,
    setTypes,
    departaments,
    setDepartaments,
  } = useContext(TasksContext);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

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

  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onClose: onTaskModalClose,
  } = useDisclosure();

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      // await getIndicatorsAnswers(
      //   id,
      //   searchParams.get("page") ?? 1,
      //   searchParams.get("search") ?? ""
      // );
      //   searchParams.set("search", inputValue);
      //   searchParams.set("page", 1);
      //   setSearchParams(searchParams);
      //   const res = await getOrigins(
      //     searchParams.get("page") ?? 1,
      //     searchParams.get("search") ?? "",
      //     setPagination
      //   );
      //   setPagination(res.pages);
      //   setOrigins(res.items);
    }
  }, 500);

  useEffect(() => {
    const updateIcons = () => {
      const deleteIcon = checkPermissionForAction("indicators", "canDelete")
        ? {
            icon: <Trash size={20} />,
            onClickRow: (item) => {
              setDeleteId(item.id);
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

      const editIcon = checkPermissionForAction("indicators", "canEdit")
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

      const addDataToIndicator = checkPermissionForAction(
        "indicators",
        "canEdit"
      )
        ? {
            icon: <Plus size={20} />,
            onClickRow: (item) => {
              setEditSelected(item.id);
              onTaskModalOpen();
            },
            onClickHeader: () => {},
            isDisabled: false,
            shouldShow: false,
          }
        : null;
      const icons = [editIcon, deleteIcon, addDataToIndicator].filter(
        (icon) => icon !== null
      );

      setTableIcons(icons);
    };

    updateIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, userAccessRule]);

  const [tableIcons, setTableIcons] = useState([]);
  return (
    <>
      <Box
        w={{ sm: "100%", md: "95%", lg: "100%" }}
        mt={"20px !important"}
        pb={"20px"}
      >
        <CustomTable
          data={indicatorsAnswers}
          columns={columns}
          title={`${t("Indicador")}`}
          icons={tableIcons}
          searchInputValue={""}
          onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
          iconsHasMaxW={true}
          onCheckItems={(show) => {
            setTableIcons(
              tableIcons.map((icon) => {
                icon.isDisabled = show;
                return icon;
              })
            );
          }}
          border="1px solid #ddd"
          borderRadius="8px"
        />
      </Box>
      <DeleteModal
        title={t("Excluir Resposta")}
        subtitle={t("Tem certeza de que deseja excluir esta resposta?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          await deleteIndicatorAnswer(deleteId);

          sleep(2000);
          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Origem")}
        subtitle={t("Tem certeza de que deseja excluir estes Indicadores?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleIndicatorsAnswers(selected);
          setIsDeleteLoading(false);
          sleep(2000);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <GraphItemForm
            formRef={formRef}
            onClose={onEditModalClose}
            onEdit={editIndicatorAnswer}
            event="edit"
            formValues={editSelected}
            setLoading={setIsLoading}
          />
        }
        formRef={formRef}
        title={t("Editar Resposta")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isTaskModalOpen}
        onClose={onTaskModalClose}
        form={
          <TaskForm
            formRef={formRef}
            onCloseModal={(res) => {
              updateTasksColumn(res);
              onTaskModalClose();
            }}
            setLoading={setIsLoading}
            origins={origins}
            classifications={classifications}
            types={types}
            departaments={departaments}
            setOrigins={setOrigins}
            setClassifications={setClassifications}
            setTypes={setTypes}
            setDepartaments={setDepartaments}
            indicator={editSelected}
          />
        }
        formRef={formRef}
        title={t("Adicionar Resposta")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
        isLoading={isLoading}
      />
    </>
  );
};

export default ItemGraphTable;
