import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { NavBar } from "components/navbar";
import {
  Box,
  Flex,
  VStack,
  useBreakpoint,
  useDisclosure,
} from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";

import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import { columns } from "./helpers/table-helper";
import {
  createDocumentReminder,
  deleteDocumentReminder,
  deleteMultipleDocumentReminders,
  getDocumentReminders,
  updateDocumentReminder,
} from "./helpers/helper";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { DeleteModal } from "components/components";
import { ModalForm } from "components/components";
import ReminderForm from "components/forms/reminders/reminder-form";
import { ButtonPrimary } from "components/button-primary";

const DocumentRemindersPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const { getToken } = useContext(AuthContext);

  const [reminders, setReminders] = useState([]);
  const [pagination, setPagination] = useState();
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editSelectedItem, setEditSelectedItem] = useState(null);
  const editFormRef = useRef();
  const AddFormRef = useRef();
  const id = queryParams.get("id");
  const name = reminders.length > 0 ? reminders[0].documentName : "";

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/documents",
      label: "Documentos",
      isCurrent: false,
    },
    {
      path: "/reminders",
      label: "Lembretes",
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
    isOpen: isFormModalOpen,
    onOpen: onFormModalOpen,
    onClose: onFormModalClose,
  } = useDisclosure();

  const {
    isOpen: isFormAddModalOpen,
    onOpen: onFormAddModalOpen,
    onClose: onFormAddModalClose,
  } = useDisclosure();

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <Trash size={20} />,
      onClickRow: (e) => {
        setDeleteId(e.id);
        onDeleteModalOpen();
      },
      onClickHeader: (selecteds) => {
        setSelectedItems(selecteds);
        onDeleteMultipleModalOpen();
      },
      isDisabled: true,
      shouldShow: true,
    },
    {
      icon: <NotePencil size={20} />,
      onClickRow: (e) => {
        setEditSelectedItem(e);
        onFormModalOpen();
      },
      onClickHeader: (selecteds) => {},
      isDisabled: false,
      shouldShow: true,
    },
  ]);
  useEffect(() => {
    getDocumentReminders(
      getToken(),
      id,
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? ""
    ).then((analysisDocuments) => {
      setReminders(analysisDocuments.items);
      setPagination(analysisDocuments.pages);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    const reminders = await getDocumentReminders(
      getToken(),
      id,
      page,
      queryParams.get("search") ?? ""
    );
    setReminders(reminders.items);
    setPagination(reminders.pages);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);

      const reminders = await getDocumentReminders(
        getToken(),
        id,
        queryParams.get("page") ?? 1,
        inputValue
      );

      setReminders(reminders.items);
      setPagination(reminders.pages);
    }
  }, 500);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <Box w={isMobile ? "100vw" : "95vw"} paddingX={isMobile ? "20px" : 0}>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            h="50"
            mb="24px"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            type="submit"
            label={t("Adicionar")}
            width="150px"
            onClick={onFormAddModalOpen}
          />
        </Box>
        <CustomTable
          data={reminders}
          columns={columns}
          title={t(`Lembretes do documento: #${id} - ${name}`)}
          searchInputValue={searchParams.get("search") ?? ""}
          onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
          iconsHasMaxW={true}
          icons={tableIcons}
        />
        <Flex
          justifyContent={"end"}
          w={isMobile ? "99vw" : "95vw"}
          bgColor={"white"}
        >
          {pagination && (
            <Pagination
              data={reminders}
              onClickPagination={updateData}
              itemsPerPage={1}
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              nextPage={pagination.next}
              lastPage={pagination.last}
            />
          )}
        </Flex>
      </VStack>
      <DeleteModal
        title={t("Excluir Lembrete")}
        subtitle={t("Tem certeza de que deseja excluir este Lembrete?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setModalLoading(true);
          await deleteDocumentReminder(
            deleteId,
            getToken(),
            setReminders,
            reminders
          );
          setModalLoading(false);
          onDeleteModalClose();
        }}
        isLoading={modalLoading}
      />
      <DeleteModal
        title={t("Excluir Lembretes")}
        subtitle={t("Tem certeza de que deseja excluir estes Lembretes?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          setModalLoading(true);
          await deleteMultipleDocumentReminders(
            selectedItems,
            getToken(),
            setReminders,
            reminders,
            false
          );
          setModalLoading(false);
          onDeleteMultipleModalClose();
        }}
        isLoading={modalLoading}
      />
      <ModalForm
        isOpen={isFormModalOpen}
        onClose={onFormModalClose}
        form={
          <ReminderForm
            formRef={editFormRef}
            onClose={onFormModalClose}
            formValues={editSelectedItem}
            event="edit"
            id={editSelectedItem?.id ?? ""}
            onEdit={async (data) => {
              setModalLoading(true);
              await updateDocumentReminder(
                data,
                getToken(),
                setReminders,
                reminders
              );
              setModalLoading(false);
              onFormModalClose();
            }}
          />
        }
        formRef={editFormRef}
        title={t("Editar Lembrete")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={modalLoading}
        modalSize="2xl"
      />
      <ModalForm
        isOpen={isFormAddModalOpen}
        onClose={onFormAddModalClose}
        form={
          <ReminderForm
            formRef={AddFormRef}
            onClose={onFormModalClose}
            onAdd={async (data) => {
              setModalLoading(true);
              const reminder = await createDocumentReminder(data, getToken());
              setReminders([...reminders, reminder]);
              setModalLoading(false);
              onFormAddModalClose();
            }}
            id={id}
          />
        }
        formRef={AddFormRef}
        title={t("Criar Lembrete")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={modalLoading}
        modalSize="2xl"
      />
    </>
  );
};

export default DocumentRemindersPage;
