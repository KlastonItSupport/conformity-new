import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { CustomTable } from "components/components";
import { HStack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { ModalForm } from "components/components";
import ReminderForm from "components/forms/reminders/reminder-form";
import { useTranslation } from "react-i18next";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { DeleteModal } from "components/components";

export const columns = [
  {
    header: "Frequência",
    access: "frequency",
  },
  {
    header: "Status",
    access: "status",
  },
  {
    header: "Data de término",
    access: "dataEnd",
    formatData: (data) => moment.utc(data).format("DD/MM/YYYY"),
  },
  {
    header: "Hora",
    access: "hour",
  },
];

const mockedData = [
  {
    frequency: "Semanal",
    status: "Ativo",
    dataEnd: "2022-10-10",
    hour: "10:00",
  },
  {
    frequency: "Mensal",
    status: "Ativo",
    dataEnd: "2022-10-10",
    hour: "10:00",
  },
  {
    frequency: "Mensal",
    status: "Active",
    dataEnd: "2022-10-10",
    hour: "10:00",
  },
];

const RemindersTable = ({ canDelete, canEdit }) => {
  const { t } = useTranslation();
  const formRef = useRef();
  const editFormRef = useRef();
  const [tableIcons, setTableIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(null);
  const [editSelected, setEditSelected] = useState(null);

  const {
    isOpen: isFormAddModalOpen,
    onOpen: onFormAddModalOpen,
    onClose: onFormAddModalClose,
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
              setEditSelected(selecteds);
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

  useEffect(() => {}, [editSelected]);
  return (
    <>
      <VStack
        alignItems={"start"}
        bgColor={"white"}
        border={"1px solid #ddd"}
        p={"20px"}
        mt={"20px"}
      >
        <HStack w={"100%"} justifyContent={"space-between"}>
          <Text fontSize={{ sm: "19px", md: "20px", lg: "24px" }}>
            Lembretes:
          </Text>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Adicionar"}
            padding={"5px"}
            w={"100px"}
            h="40px"
            type="submit"
            onClick={onFormAddModalOpen}
          />
        </HStack>

        <CustomTable
          data={mockedData}
          columns={columns}
          showSearchInput={false}
          iconsHasMaxW={true}
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

          //   icons={tableIcons}
        />
      </VStack>
      <ModalForm
        isOpen={isFormAddModalOpen}
        onClose={onFormAddModalClose}
        form={
          <ReminderForm
            formRef={formRef}
            onClose={onFormAddModalClose}
            onAdd={async (data) => {}}
            id={1}
          />
        }
        formRef={formRef}
        title={t("Criar Lembrete")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={false}
        modalSize="2xl"
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <ReminderForm
            formRef={editFormRef}
            onClose={onEditModalClose}
            formValues={editSelected}
            event="edit"
            id={2}
            onEdit={async (data) => {
              // setModalLoading(true);
              // await updateDocumentReminder(
              //   data,
              //   getToken(),
              //   setReminders,
              //   reminders
              // );
              // setModalLoading(false);
              onEditModalClose();
            }}
          />
        }
        formRef={editFormRef}
        title={t("Editar Lembrete")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={false}
        modalSize="2xl"
      />
      <DeleteModal
        title={t("Excluir Lembrete")}
        subtitle={t("Tem certeza de que deseja excluir este Lembrete?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          onDeleteModalClose();
        }}
        isLoading={false}
      />
      <DeleteModal
        title={t("Excluir Lembretes")}
        subtitle={t("Tem certeza de que deseja excluir estes Lembretes?")}
        isOpen={isDeleteMultipleModalOpen}
        onClose={onDeleteMultipleModalClose}
        onConfirm={async () => {
          onDeleteMultipleModalClose();
        }}
        isLoading={false}
      />
    </>
  );
};

export default RemindersTable;
