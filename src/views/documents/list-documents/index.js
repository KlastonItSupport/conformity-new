import { CustomTable } from "components/components";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns, mockedData } from "./table-helper";
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  NotePencil,
  Trash,
} from "@phosphor-icons/react";
import { NavBar } from "components/navbar";
import { Flex, VStack, useBreakpoint, useDisclosure } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";
import Filters from "./components/filters";
import ActionsButtons from "./components/actions-buttons";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";
import { ModalForm } from "components/components";
import DocumentForm from "components/forms/documents/create-document/create-document";

const ListDocumentsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const formRef = useRef(null);

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <MagnifyingGlass size={20} />,
      onClickRow: (item) => {},
      onClickHeader: () => {},
      isDisabled: false,
      shouldShow: false,
    },
    {
      icon: <Trash size={20} />,
      onClickRow: (item) => onDeleteModalOpen(),
      onClickHeader: () => {},
      isDisabled: false,
      shouldShow: true,
    },
    {
      icon: <NotePencil size={20} />,
      onClickRow: (item) => onAddModalOpen(),
      onClickHeader: () => {},
      isDisabled: false,
      shouldShow: false,
    },
    {
      icon: <ClockCounterClockwise size={20} />,
      onClickRow: (item) => {},
      onClickHeader: () => {},
      isDisabled: false,
      shouldShow: false,
    },
  ]);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/documents",
      label: "Documentos",
      isCurrent: true,
    },
  ];

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <ActionsButtons />
        <Filters />
        <CustomTable
          data={mockedData}
          columns={columns}
          title={t("Documentos Cadastrados")}
          icons={tableIcons}
          onChangeSearchInput={(e) => {}}
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
          <Pagination
            data={mockedData}
            onClickPagination={() => {}}
            itemsPerPage={5}
            totalPages={2}
            currentPage={1}
            nextPage={1}
            lastPage={2}
          />
        </Flex>
      </VStack>
      <DeleteModal
        title={t("Excluir Documento")}
        subtitle={t("Tem certeza de que deseja excluir este Documento?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await sleep(1500);
          setIsDeleteLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={onAddModalClose}
        form={<DocumentForm formRef={formRef} onClose={onAddModalClose} />}
        formRef={formRef}
        title={t("Editar Documento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
      />
    </>
  );
};

export default ListDocumentsPage;
