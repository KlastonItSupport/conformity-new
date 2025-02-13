import { useRef, useState } from "react";
import { Box, VStack, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { columns } from "./companieArray";
import { NotePencil } from "@phosphor-icons/react";
import { CompanyContext } from "providers/company";
import { useBreakpoint } from "hooks/usebreakpoint";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { AuthContext } from "providers/auth";
import {
  Pagination,
  CustomTable,
  ButtonPrimary,
  ModalForm,
  CompanyForm,
  NavBar,
  NavigationLinks,
} from "components/components";
import { useTranslation } from "react-i18next";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { AUDIT_EVENTS } from "constants/audit-events";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";

const CompaniesPage = () => {
  const { getUserInfo, dispatchAuditEvent } = useContext(AuthContext);
  const { isMobile, isDesktop } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const { t } = useTranslation();

  const {
    editId,
    setEditId,
    companies,
    itemsPerPage,
    getCompanies,
    pagination,
    editCompanyIsLoading,
    createCompanyIsLoading,
  } = useContext(CompanyContext);

  const formRef = useRef(null);

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.COMPANY_LIST);

    const fetchData = async () => {
      if (!getUserInfo()) {
        return;
      }
      const currentPage = queryParams.get("page");
      const searchQuery = queryParams.get("search");

      if (!currentPage) {
        searchParams.set("page", 1);
        setSearchParams(searchParams);
      }
      if (!searchQuery) {
        searchParams.set("search", "");
        setSearchParams(searchParams);
      }
      const page = !currentPage ? 1 : currentPage;
      const search = !searchQuery ? "" : searchQuery;

      getCompanies(page, search);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddUserModalOpen,
    onOpen: onAddUserModalOpen,
    onClose: onAddUserModalClose,
  } = useDisclosure();

  const handleEditModalOpen = (item) => {
    setEditId(item);
    onEditModalOpen();
  };

  const [tableIcons, setTableIcons] = useState([
    {
      icon: <NotePencil size={20} />,
      onClickRow: (item) => handleEditModalOpen(item),
      onClickHeader: () => [],
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
      path: "/companies",
      label: "Empresas",
      isCurrent: true,
    },
  ];

  const updateData = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    getCompanies(page, queryParams.get("search"));
  };

  const debouncedSearch = debounce((inputValue) => {
    if (inputValue.length >= 3 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);
      setSearchParams(searchParams);
      getCompanies(1, inputValue);
    }
  }, 500);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Empresas")}
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
              onClick={onAddUserModalOpen}
              width="150px"
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
              data={companies}
              columns={columns}
              title={t("")}
              icons={tableIcons}
              onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
              searchInputValue={queryParams.get("search")}
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
                  data={companies}
                  onClickPagination={updateData}
                  itemsPerPage={itemsPerPage}
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

      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        id={editId}
        form={
          <CompanyForm
            formRef={formRef}
            onCloseModal={onEditModalClose}
            formValues={editId}
            event={"edit"}
          />
        }
        formRef={formRef}
        title={t("Editar Empresa")}
        description={t("Tem certeza de que deseja Editar esta empresa?")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize={isDesktop ? "4xl" : "xl"}
        isLoading={editCompanyIsLoading}
      />
      <ModalForm
        isOpen={isAddUserModalOpen}
        onClose={onAddUserModalClose}
        id={editId}
        form={
          <CompanyForm formRef={formRef} onCloseModal={onAddUserModalClose} />
        }
        formRef={formRef}
        title={t("Adicionar Empresa")}
        description={""}
        leftButtonLabel={"Cancelar"}
        rightButtonLabel={"Criar"}
        modalSize={isDesktop ? "4xl" : "xl"}
        isLoading={createCompanyIsLoading}
      />
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("companies"),
  withWarningCheck
)(CompaniesPage);
