import { CustomTable } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
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

import { ModalForm } from "components/components";
import DocumentForm from "components/forms/documents/create-document/create-document";
import { DocumentContext } from "providers/document";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";

const ListDocumentsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const {
    documents,
    setDocuments,
    getDocuments,
    deleteDocument,
    deleteId,
    setDeleteId,
    editSelected,
    setEditSelected,
    pagination,
  } = useContext(DocumentContext);
  const formRef = useRef(null);

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
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

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
      onClickRow: (item) => {
        setDeleteId(item.id);
        onDeleteModalOpen();
      },
      onClickHeader: () => {},
      isDisabled: false,
      shouldShow: true,
    },
    {
      icon: <NotePencil size={20} />,
      onClickRow: (item) => {
        setEditSelected(item);
        console.log("item", item);
        onEditModalOpen();
      },
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

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    const documents = await getDocuments(page, queryParams.get("search"), {
      initialDate: queryParams.get("initialDate"),
      finalDate: queryParams.get("finalDate"),
      departamentId: queryParams.get("departamentId"),
      category: queryParams.get("category"),
    });
    console.log("documents", documents);

    setDocuments(documents.items);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const documents = await getDocuments(1, inputValue);

      setDocuments(documents.items);
    }
  }, 500);

  const handlingSearchParams = () => {
    const params = {};

    if (searchParams.get("initialDate")) {
      params.initialDate = searchParams.get("initialDate");
    }
    if (searchParams.get("finalDate")) {
      params.finalDate = searchParams.get("finalDate");
    }
    if (searchParams.get("departamentId")) {
      params.departamentId = searchParams.get("departamentId");
    }
    if (searchParams.get("categoryId")) {
      params.categoryId = searchParams.get("categoryId");
    }

    return params;
  };
  useEffect(() => {
    getDocuments(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      handlingSearchParams()
    ).then((data) => setDocuments(data.items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <ActionsButtons />
        <Filters />
        <CustomTable
          data={documents}
          columns={columns}
          title={t("Documentos Cadastrados")}
          icons={tableIcons}
          searchInputValue={searchParams.get("search") ?? ""}
          onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
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
              data={mockedData}
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
        title={t("Excluir Documento")}
        subtitle={t("Tem certeza de que deseja excluir este Documento?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);

          await deleteDocument(deleteId);
          setDocuments(
            documents.filter((document) => document.id !== deleteId)
          );

          setIsDeleteLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <DocumentForm
            formRef={formRef}
            onClose={onEditModalClose}
            formValues={editSelected}
            event="edit"
            setIsLoading={setIsEditLoading}
          />
        }
        formRef={formRef}
        title={t("Editar Documento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="2xl"
        isLoading={isEditLoading}
      />
    </>
  );
};

export default ListDocumentsPage;
