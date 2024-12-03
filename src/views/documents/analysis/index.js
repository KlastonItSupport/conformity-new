import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./table-helper";
import {
  Check,
  MagnifyingGlass,
  Prohibit,
  ThumbsUp,
} from "@phosphor-icons/react";
import { NavBar } from "components/navbar";
import { Flex, VStack, useBreakpoint, useDisclosure } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";

import { ModalForm } from "components/components";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AnalysisContext } from "providers/analysis";
import AlertModal from "components/modals/alert-modal";
import CancelDescription from "components/forms/analysis/cancel-description";
import withAuthenticated from "hoc/with-authenticated";
import { compose } from "recompose";
import withWarningCheck from "hoc/with-warning-check";
import { AuthContext } from "providers/auth";
import { AUDIT_EVENTS } from "constants/audit-events";

const AnalysisPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const { dispatchAuditEvent } = useContext(AuthContext);
  const {
    getAnalysisDocuments,
    analysisDocuments,
    setAnalysisDocuments,
    pagination,
    reviewAnalysisDocuments,
    approveAnalysisDocuments,
    cancelReviewAnalysisDocuments,
    approveMultipleAnalysisDocuments,
    reviewMultipleAnalysisDocuments,
  } = useContext(AnalysisContext);

  const [modalLoading, setModalLoading] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [approveId, setApproveId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [selected, setSelected] = useState([]);
  const cancelRef = useRef(null);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/analysis",
      label: "Para Análise",
      isCurrent: true,
    },
  ];

  const {
    isOpen: isAlertModalOpen,
    onOpen: onAlertModalOpen,
    onClose: onAlertModalClose,
  } = useDisclosure();

  const {
    isOpen: isAlertMultipleModalOpen,
    onOpen: onAlertMultipleModalOpen,
    onClose: onAlertMultipleModalClose,
  } = useDisclosure();

  const {
    isOpen: isCancelModalOpen,
    onOpen: onCancelModalOpen,
    onClose: onCancelModalClose,
  } = useDisclosure();

  const {
    isOpen: isApproveModalOpen,
    onOpen: onApproveModalOpen,
    onClose: onApproveModalClose,
  } = useDisclosure();

  const {
    isOpen: isApproveMultipleModalOpen,
    onOpen: onApproveMultipleModalOpen,
    onClose: onApproveMultipleModalClose,
  } = useDisclosure();

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.DOCUMENTS_ANALYSIS_LIST);
    getAnalysisDocuments(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? ""
    ).then((analysisDocuments) => {
      setAnalysisDocuments(analysisDocuments);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <MagnifyingGlass size={20} />,
      onClickRow: (item) => {
        window.open(`/documents/details?id=${item.documentId}`, "_blank");
      },
      onClickHeader: (selecteds) => {},
      isDisabled: false,
      shouldShow: false,
      title: "Visualizar Documento",
    },
    {
      icon: <Check size={20} />,
      onClickRow: (item) => {
        setReviewId(item.id);
        onAlertModalOpen();
      },
      onClickHeader: (selecteds) => {
        setSelected(selecteds);
        onAlertMultipleModalOpen();
      },
      isDisabled: false,
      shouldShow: true,
      title: "Revisar",
      condition: (item) => item.reviewed === 1,
    },
    {
      icon: <ThumbsUp size={20} />,
      onClickRow: (item) => {
        setApproveId(item.id);
        onApproveModalOpen();
      },
      onClickHeader: (selecteds) => {
        setSelected(selecteds);
        onApproveMultipleModalOpen();
      },
      isDisabled: false,
      shouldShow: true,
      title: "Aprovar Documento",
      condition: (item) =>
        (item.reviewed === 2 || item.reviewed === 0) && item.approved === 1,
    },
    {
      icon: <Prohibit size={20} />,
      onClickRow: (item) => {
        setCancelId(item.id);
        onCancelModalOpen();
      },
      onClickHeader: (selecteds) => {},
      isDisabled: false,
      shouldShow: false,
      title: "Cancelar Revisão",
    },
  ]);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    const analysisDocuments = await getAnalysisDocuments(
      page,
      queryParams.get("search") ?? ""
    );
    setAnalysisDocuments(analysisDocuments);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const documents = await getAnalysisDocuments(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? ""
      );

      setAnalysisDocuments(documents);
    }
  }, 500);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />

        <CustomTable
          data={analysisDocuments}
          columns={columns}
          title={t("Documentos para análise e aprovação")}
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
              data={analysisDocuments}
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
      <AlertModal
        title={t("Revisar Documento")}
        subtitle={t("Tem certeza de que deseja revisar este documento?")}
        isOpen={isAlertModalOpen}
        onClose={onAlertModalClose}
        onConfirm={async () => {
          setModalLoading(true);

          await reviewAnalysisDocuments(reviewId);
          setModalLoading(false);

          onAlertModalClose();
        }}
        isLoading={modalLoading}
      />
      <AlertModal
        title={t("Revisar Documentos")}
        subtitle={t("Tem certeza de que deseja revisar estes documentos?")}
        isOpen={isAlertMultipleModalOpen}
        onClose={onAlertMultipleModalClose}
        onConfirm={async () => {
          setModalLoading(true);

          await reviewMultipleAnalysisDocuments(selected);
          setModalLoading(false);

          onAlertMultipleModalClose();
        }}
        isLoading={modalLoading}
      />
      <AlertModal
        title={t("Aprovar Documento")}
        subtitle={t("Tem certeza de que deseja aprovar este documento?")}
        isOpen={isApproveModalOpen}
        onClose={onApproveModalClose}
        onConfirm={async () => {
          setModalLoading(true);

          await approveAnalysisDocuments(approveId);
          setModalLoading(false);

          onApproveModalClose();
        }}
        isLoading={modalLoading}
      />
      <AlertModal
        title={t("Aprovar Documentos")}
        subtitle={t("Tem certeza de que deseja aprovar estes documentos?")}
        isOpen={isApproveMultipleModalOpen}
        onClose={onApproveMultipleModalClose}
        onConfirm={async () => {
          setModalLoading(true);

          await approveMultipleAnalysisDocuments(selected);
          setModalLoading(false);

          onApproveMultipleModalClose();
        }}
        isLoading={modalLoading}
      />
      <ModalForm
        isOpen={isCancelModalOpen}
        onClose={onCancelModalClose}
        form={
          <CancelDescription
            onClose={onCancelModalClose}
            setLoading={setModalLoading}
            onConfirm={(data) => {
              cancelReviewAnalysisDocuments(cancelId, data.description);
            }}
            formRef={cancelRef}
          />
        }
        formRef={cancelRef}
        title={t("Descrição do cancelamento")}
        leftButtonLabel={t("Fechar")}
        rightButtonLabel={t("Confirmar")}
        isLoading={modalLoading}
      />
    </>
  );
};

export default compose(
  withAuthenticated("documents"),
  withWarningCheck
)(AnalysisPage);
