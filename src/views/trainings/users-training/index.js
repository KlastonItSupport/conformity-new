import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import { Folder, NotePencil, Trash } from "@phosphor-icons/react";
import { NavBar } from "components/navbar";
import {
  Flex,
  HStack,
  VStack,
  useBreakpoint,
  useDisclosure,
  Box,
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
import MyTrainingForm from "./components/my-training-form";
import { TrainingsUserContext } from "providers/trainings-user";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { AUDIT_EVENTS } from "constants/audit-events";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";

const TrainingUsers = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editSelected, setEditSelected] = useState(false);
  const [usersTrainings, setUsersTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  const {
    getUserTrainings,
    deleteTraining,
    deleteMultipleTrainings,
    createTraining,
    editTraining,
  } = useContext(TrainingsUserContext);

  const {
    userPermissions,
    userAccessRule,
    checkPermissionForAction,
    getUserInfo,
    dispatchAuditEvent,
  } = useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/trainings/users-training",
      label: "Meus Treinamentos",
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

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.TRAININGS_USER_LIST);
    getUserTrainings(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      setPagination
    ).then((res) => {
      setUsersTrainings(res.items);
      setPagination(res.pages);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateIcons = () => {
      const folderIcon = checkPermissionForAction("trainings", "canAdd")
        ? {
            icon: <Folder size={20} />,
            onClickRow: (item) =>
              window.open(`/trainings/certificates/${item.id}`),

            onClickHeader: (selecteds) => {
              setSelected(selecteds);
              onDeleteMultipleModalOpen();
            },
            isDisabled: false,
            shouldShow: true,
          }
        : null;
      const deleteIcon = checkPermissionForAction("trainings", "canDelete")
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

      const editIcon = checkPermissionForAction("trainings", "canEdit")
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

      const icons = [folderIcon, editIcon, deleteIcon].filter(
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
    const res = await getUserTrainings(
      page,
      queryParams.get("search") ?? "",
      setPagination
    );
    setPagination(res.pages);
    setUsersTrainings(res.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getUserTrainings(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        setPagination
      );

      setPagination(res.pages);
      setUsersTrainings(res.items);
    }
  }, 500);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Meus Treinamentos")}
      />
      <Box
        marginTop="64px"
        w="100%"
        px={6}
      >
        <VStack 
          spacing={3}
          w="100%"
          align="stretch"
        >
          <Box>
            <NavigationLinks routeTree={routeTreePaths} />
          </Box>

          <Box>
            <ButtonPrimary
              fontSize="sm"
              fontWeight="bold"
              h="40px"
              bgColor="header.100"
              _hover={{ bgColor: "primary.200" }}
              textColor="white"
              boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
              borderRadius="7px"
              _active={{ bgColor: "primary.200" }}
              label="Adicionar"
              onClick={onAddModalOpen}
              width="150px"
              disabled={!checkPermissionForAction("trainings", "canAdd")}
            />
          </Box>
          
          <Box 
            w="100%" 
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
          >
            <CustomTable
              data={usersTrainings}
              columns={columns}
              title={t(`Treinamentos de ${getUserInfo().name}`)}
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
            {pagination && (
              <Box 
                p={4} 
                borderTop="1px solid" 
                borderColor="gray.100"
              >
                <Pagination
                  data={usersTrainings}
                  onClickPagination={updateData}
                  itemsPerPage={5}
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                  nextPage={pagination.next}
                  lastPage={pagination.last}
                />
              </Box>
            )}
          </Box>
        </VStack>
      </Box>

      {/* Modals */}
      <DeleteModal
        title={t("Excluir Treinamento")}
        subtitle={t("Tem certeza de que deseja excluir esta Treinamento?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsLoading(true);

          const response = await deleteTraining(deleteId);
          if (response) {
            setUsersTrainings(
              usersTrainings.filter((category) => category.id !== deleteId)
            );
          }

          setIsLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isLoading}
      />
      <DeleteModal
        title={t("Excluir Treinamentos")}
        subtitle={t("Tem certeza de que deseja excluir estas Treinamentos?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await deleteMultipleTrainings(
            selected,
            setUsersTrainings,
            usersTrainings
          );
          setIsDeleteLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <MyTrainingForm
            formRef={categoryRef}
            onClose={(origin) => {
              onEditModalClose();
              const servicesCopy = [...usersTrainings];
              const index = servicesCopy.findIndex(
                (item) => item.id === origin.id
              );
              servicesCopy[index] = origin;
              setUsersTrainings(servicesCopy);
            }}
            event="edit"
            onEdit={editTraining}
            id={editSelected.id}
            formValues={editSelected}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Editar Treinamento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="lg"
        isLoading={isLoading}
      />

      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={
          <MyTrainingForm
            formRef={categoryRef}
            onClose={(origin) => {
              onAddModalClose();
              setUsersTrainings([origin, ...usersTrainings]);
            }}
            event="add"
            onAdd={createTraining}
            setLoading={setIsLoading}
          />
        }
        formRef={categoryRef}
        title={t("Adicionar Treinamento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Adicionar")}
        modalSize="lg"
        isLoading={isLoading}
      />
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("training"),
  withWarningCheck
)(TrainingUsers);
