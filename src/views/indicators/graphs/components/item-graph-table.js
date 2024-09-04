import { Box, Flex, useBreakpoint, useDisclosure } from "@chakra-ui/react";
import { NotePencil, Plus, Trash } from "@phosphor-icons/react";
import { DeleteModal } from "components/components";
import { ModalForm } from "components/components";
import { Pagination } from "components/components";
import { CustomTable } from "components/components";
import TaskForm from "components/forms/tasks/task-form";
import { sleep } from "helpers/sleep";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import GraphItemForm from "views/indicators/graph-items/graph-item.form";
import { columns } from "views/indicators/graph-items/table-helper";
import { mockedData } from "views/indicators/graph-items/table-helper";

const ItemGraphTable = () => {
  const name = "TI - Tipo de dado: PERCENTUAL - Frequência: MENSAL";
  const { t } = useTranslation();
  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);
  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 3,
    currentPage: 1,
    next: 2,
    last: 3,
  });
  const { isMobile } = useBreakpoint();
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

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
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
      <Box w={"100%"} mt={"20px !important"} pb={"20px"}>
        <CustomTable
          data={mockedData}
          columns={columns}
          title={`${t("Indicador")}: ${name}`}
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
          paginationComponent={
            <Flex
              justifyContent={"end"}
              bgColor={"white"}
              pt={"25px"}
              pr={"5px"}
            >
              {pagination && (
                <Pagination
                  data={mockedData}
                  onClickPagination={() => {}}
                  itemsPerPage={5}
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                  nextPage={pagination.next}
                  lastPage={pagination.last}
                  hasPadding={false}
                />
              )}
            </Flex>
          }
        />
      </Box>
      <DeleteModal
        title={t("Excluir Resposta")}
        subtitle={t("Tem certeza de que deseja excluir esta resposta?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          // const response = await deleteOrigin(deleteId);
          // if (response) {
          //   setOrigins(origins.filter((category) => category.id !== deleteId));
          // }

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
          // await deleteMultipleOrigins(selected, setOrigins, origins);
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
            onClose={onAddModalClose}
            onEdit={() => {}}
            event="edit"
            formValues={editSelected}
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
        form={<TaskForm />}
        formRef={formRef}
        title={t("Adicionar Resposta")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="xl"
        isLoading={isLoading}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <GraphItemForm
            formRef={formRef}
            onClose={onAddModalClose}
            onAdd={() => {
              <TaskForm />;
            }}
            event="add"
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
