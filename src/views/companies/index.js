import { useRef, useState } from "react";
import { Box, Flex, VStack, useDisclosure } from "@chakra-ui/react";
// import { AuthContext } from "providers/auth";
import { useContext, useEffect } from "react";
import CustomTable from "../../components/customTable";
import { columns } from "./companieArray";
import { Pagination } from "../../components/pagination/pagination";
import { ArrowsLeftRight, NotePencil } from "@phosphor-icons/react";
import { ButtonPrimary } from "components/button-primary";
import NavigationLinks from "components/navigationLinks";
import { ModalForm } from "components/modals/modalForm";
import { CompanyForm } from "components/forms/companies/company/company";
import { CompanyContext } from "providers/company";
import { NavBar } from "components/navbar";
import { useBreakpoint } from "hooks/usebreakpoint";

export const CompaniesPage = () => {
  // const { dealingWithAuth } = useContext(AuthContext);
  const { isMobile, isDesktop } = useBreakpoint();

  const {
    editId,
    changeEditId,
    companies,
    updatePagination,
    itemsPerPage,
    companiesCopy,
    currentPage,
    getCompanies,
  } = useContext(CompanyContext);

  const formRef = useRef(null);

  useEffect(() => {
    // dealingWithAuth(true, "/users", history);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCompanies();
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
    changeEditId(item);
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
    {
      icon: <ArrowsLeftRight size={20} />,
      onClickRow: () => {},
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
      path: "/companies",
      label: "Empresas",
      isCurrent: true,
    },
  ];

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
            label=" + Adicionar"
            width="150px"
            onClick={onAddUserModalOpen}
          />
        </Box>

        <CustomTable
          data={companies}
          columns={columns}
          title={"Empresas"}
          icons={tableIcons}
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
            data={companiesCopy}
            onClickPagination={updatePagination}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
          />
        </Flex>
        {/* <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        id={editId}
        form={<EditUsersForm formRef={formRef} />}
        formRef={formRef}
        title={"Editar Usuário"}
        description={"Tem certeza de que deseja Editar este usuário?"}
        leftButtonLabel={"Cancelar"}
        rightButtonLabel={"Editar"}
      /> */}
        <ModalForm
          isOpen={isAddUserModalOpen}
          onClose={onAddUserModalClose}
          id={editId}
          form={
            <CompanyForm formRef={formRef} onCloseModal={onAddUserModalClose} />
          }
          formRef={formRef}
          title={"Adicionar Empresa"}
          description={""}
          leftButtonLabel={"Cancelar"}
          rightButtonLabel={"Criar"}
          modalSize={isDesktop ? "4xl" : "xl"}
        />
        {/* <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        id={editId}
        form={<CompanyForm formRef={formRef} />}
        formRef={formRef}
        title={"Editar empresa"}
        description={""}
        leftButtonLabel={"Cancelar"}
        rightButtonLabel={"Editar"}
        modalSize={isDesktop ? "4xl" : "xl"}
      /> */}
      </VStack>
    </>
  );
};
