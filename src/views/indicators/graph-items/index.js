import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import { NotePencil, Plus, Trash } from "@phosphor-icons/react";
import { NavBar } from "components/navbar";
import {
  Flex,
  HStack,
  VStack,
  useBreakpoint,
  useDisclosure,
} from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";
import { DeleteModal } from "components/components";

import { ModalForm } from "components/components";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import { ButtonPrimary } from "components/button-primary";
import GraphItemForm from "./graph-item.form";
import TaskForm from "components/forms/tasks/task-form";
import { IndicatorsAnswerContext } from "providers/indicator-answer";
import { TasksContext } from "providers/tasks";

const GraphItemsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const formRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const name = queryParams.get("name");
  const id = queryParams.get("id");
  const department = queryParams.get("department");
  const dataType = queryParams.get("dataType");
  const frequency = queryParams.get("frequency");

  const {
    getIndicatorsAnswers,
    indicatorsAnswers,
    updateTasksColumn,
    deleteIndicatorAnswer,
    deleteMultipleIndicatorsAnswers,
    pagination,
    addIndicatorAnswer,
    editIndicatorAnswer,
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

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/indicators",
      label: "Indicadores",
      isCurrent: false,
    },
    {
      path: "/indicators/graph-items",
      label: "Formulários",
      isCurrent: true,
    },
  ];

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
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onClose: onTaskModalClose,
  } = useDisclosure();

  useEffect(() => {
    getIndicatorsAnswers(
      id,
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? ""
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [userPermissions, userAccessRule]); // Atualiza os ícones quando userPermissions muda

  const [tableIcons, setTableIcons] = useState([]);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    await getIndicatorsAnswers(id, page, queryParams.get("search") ?? "");
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      await getIndicatorsAnswers(
        id,
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? ""
      );
    }
  }, 500);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%" paddingX="24px">
        <NavigationLinks routeTree={routeTreePaths} />
        <HStack
          display={"flex"}
          justifyContent={{ sm: "space-between", lg: "start" }}
          w={"95vw"}
          py={"20px"}
        >
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="50"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Adicionar"}
            onClick={onAddModalOpen}
            width="150px"
            disabled={!checkPermissionForAction("indicators", "canAdd")}
          />
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="50"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Vizualizar Gráfico"}
            onClick={() => {
              window.open(
                `/indicators/graphs?id=${id}&department=${department}&dataType=${dataType}&frequency=${frequency}`,
                "_blank"
              );
            }}
            width="150px"
            disabled={!checkPermissionForAction("indicators", "canAdd")}
          />
        </HStack>

        <CustomTable
          data={indicatorsAnswers}
          columns={columns}
          title={`${t("Indicador")}: ${name}`}
          icons={tableIcons}
          searchInputValue={searchParams.get("search") ?? ""}
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
        />
        <Flex
          justifyContent={"end"}
          w={isMobile ? "99vw" : "95vw"}
          bgColor={"white"}
        >
          {pagination && (
            <Pagination
              data={indicatorsAnswers}
              onClickPagination={updateData}
              itemsPerPage={5}
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              nextPage={pagination.next}
              lastPage={pagination.last}
            />
          )}
        </Flex>
      </VStack>
      <DeleteModal
        title={t("Excluir Resposta")}
        subtitle={t("Tem certeza de que deseja excluir esta resposta?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          await deleteIndicatorAnswer(deleteId);

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
            id={id}
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
        title={t("Adicionar Tarefa")}
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
            onAdd={addIndicatorAnswer}
            event="add"
            setLoading={setIsLoading}
            id={id}
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

export default GraphItemsPage;
