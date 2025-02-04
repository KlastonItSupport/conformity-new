import {
  Box,
  HStack,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  VStack,
  keyframes,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import whiteLogo from "../../assets/img/logo_branco.png";
import {
  FolderSimple,
  House,
  CheckFat,
  Gear,
  ChartLineUp,
  HardDrives,
  Users,
  List,
  X,
  Buildings,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { ItemMenu } from "./components/item-menu.js";
import { UserInfo } from "./components/user-info";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "providers/auth";
import { useTranslation } from "react-i18next";
import undefinedPic from "assets/img/undefined-pic.png";
import { AUDIT_EVENTS } from "constants/audit-events";
import Notification from "./components/notification";

const animation = keyframes`
  from {top: 0px;}
  to {top: 200px;}
`;

export const NavBar = () => {
  const { t } = useTranslation();
  const finalAnimation = `${animation} 2s`;
  const {
    logout,
    getUserInfo,
    user,
    setUser,
    getUserPermission,
    permissions,
    setPermissions,
    getUserAccessRule,
    userAccessRule,
    dispatchAuditEvent,
  } = useContext(AuthContext);
  const history = useNavigate();
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const checkingPermission = (type) => {
    if (userAccessRule?.isAdmin) {
      return true;
    }

    if (userAccessRule?.isSuperUser && type !== "admin") {
      return true;
    }

    if (type === "admin") return false;
    if (type === "dashboard") return true;

    const permission = permissions[type];
    if (!permission) {
      return false;
    }
    const shouldShowModule =
      permission.canAdd ||
      permission.canDelete ||
      permission.canEdit ||
      permission.canRead;

    return shouldShowModule;
  };

  const iconsMenu = [
       {
      type: "dashboard",
      icon: (
        <Box 
          onClick={() => navigate("/dashboard")}
          cursor="pointer" 
          color="white" 
          _hover={{ color: "#87A3BC" }}
        >
          <House size={24} />
        </Box>
      ),
    },
    {
      type: "documents",
      icon: (
        <ItemMenu
          icon={<FolderSimple size={24} />}
          itemsList={[
            {
              src: "/documents",
              label: "Documentos Cadastrados",
            },
            {
              src: "/categories",
              label: "Categorias",
            },
            {
              src: "/analysis",
              label: "Para Análise",
            },
          ]}
          key={"admin-documents"}
        />
      ),
    },
    {
      type: "tasks",
      icon: (
        <ItemMenu
          icon={<CheckFat size={24} />}
          itemsList={[
            {
              src: "/tasks",
              label: "Tasks",
            },
            {
              src: "/tasks/origins",
              label: "Origens",
            },
            {
              src: "/tasks/types",
              label: "Tipos",
            },
            {
              src: "/tasks/classifications",
              label: "Classificações",
            },
          ]}
          key={"admin-tasks"}
        />
      ),
    },
    {
      type: "equipments",
      icon: (
        <ItemMenu
          icon={<Gear size={24} />}
          itemsList={[
            {
              src: "/equipments",
              label: "Equipamentos",
            },
          ]}
          key={"admin-equipments"}
        />
      ),
    },
    {
      type: "indicators",
      icon: (
        <ItemMenu
          icon={<ChartLineUp size={24} />}
          itemsList={[
            {
              src: "/indicators/graphs",
              label: "Dashboard/ Gráficos",
            },
            {
              src: "/indicators",
              label: "Indicadores",
            },
          ]}
          key={"admin-indicators"}
        />
      ),
    },
    {
      type: "crm",
      icon: (
        <ItemMenu
          icon={<HardDrives size={24} />}
          itemsList={[
            {
              src: "/crm/clients-suppliers",
              label: "Clientes / Fornecedores",
            },
            {
              src: "/crm/leads",
              label: "Leads",
            },
            {
              src: "/crm/projects",
              label: "Projetos",
            },
            {
              src: "/crm/contracts",
              label: "Contratos",
            },
            {
              src: "/crm/services",
              label: "Serviços",
            },
          ]}
          key={"admin-crm"}
        />
      ),
    },
    {
      type: "users",
      icon: (
        <ItemMenu
          icon={<Users size={24} />}
          itemsList={[
            {
              src: "/trainings",
              label: "Treinamentos",
            },
            {
              src: "/trainings/users-training",
              label: "Meus treinamentos",
            },
            {
              src: "/trainings/schools",
              label: "Escolas",
            },
            {
              src: "/trainings/matriz",
              label: "Matriz",
            },
          ]}
          key={"admin-users"}
        />
      ),
    },
    {
      type: "companies",
      icon: (
        <ItemMenu
          icon={<Buildings size={24} />}
          itemsList={[
            {
              src: "/companies/roles",
              label: "Cargos",
            },
            {
              src: "/companies/warnings",
              label: "Avisos",
            },
            {
              src: "/companies/monitoring",
              label: "Monitoramento",
            },
          ]}
          key={"admin-companies"}
        />
      ),
    },
    {
      type: "admin",
      icon: (
        <ItemMenu
          label={t("Administração")}
          itemsList={[
            {
              src: "/companies",
              label: t("Empresas"),
            },
            {
              src: "/users",
              label: t("Usuários"),
            },
            {
              src: "/groups",
              label: t("Grupos e Permissões"),
            },
            {
              src: "/companies/blog",
              label: t("Blog"),
            },
            {
              src: "/companies/blog-categories",
              label: t("Categorias do Blog"),
            },
          ]}
          key={"admin-admin"}
        />
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        const userInfo = getUserInfo();
        setUser(userInfo);
      }

      if (user && user.id) {
        await getUserAccessRule();

        if (!permissions) {
          const response = await getUserPermission();
          setPermissions(response);
        }
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
<HStack
  w={"calc(100% - 32px)"} // Ajusta el ancho para dejar espacio para el margen
  bgColor={"#3b5366"}
  height={"65px"}
  marginRight={"16px"}
  marginTop={"16px"}
  marginBottom={"40px"}
  padding={"16px"}
  position={"fixed"}
  top={0}
  right={0} // Asegura que el NavBar esté alineado a la derecha
  zIndex={1000} // Asegura que esté por encima de otros elementos
  borderRadius={"50px"}
  boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
  boxSizing="border-box" // Incluye el padding en el cálculo del ancho
>
        {/* Left section */}
        <HStack w={"50%"} spacing={6}>
          {/* Logo */}
          <Img
            src={whiteLogo}
            w={"124px"}
            onClick={() => navigate("/dashboard")}
            cursor={"pointer"}
          />
          
          {/* Support button */}
          <Text
            fontSize={"md"}
            color={"white"}
            cursor={"pointer"}
            transition="all 0.2s"
            _hover={{ color: "#87A3BC" }}
            onClick={() => navigate("/support")}
            fontWeight="medium"
          >
            Suporte
          </Text>

          {/* Search bar */}
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <MagnifyingGlass size={20} color="#87A3BC" />
            </InputLeftElement>
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="md"
              variant="filled"
              bg="rgba(255, 255, 255, 0.1)"
              border="1px solid rgba(134, 162, 187, 0.1)"
              _placeholder={{ color: "#87A3BC" }}
              _hover={{
                bg: "rgba(255, 255, 255, 0.15)",
              }}
              _focus={{
                bg: "rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(134, 162, 187, 0.3)",
              }}
              color="white"
              borderRadius="full"
            />
          </InputGroup>

          {/* Notification */}
          <Notification />
        </HStack>

        {/* Right section */}
        {isDesktop && (
          <HStack w={"50%"} justifyContent={"flex-end"} spacing={6}>
            {isLoading ? (
              <HStack>
                <Text mr={"20px"} color={"white"}>
                  Carregando permissões
                </Text>
                <Spinner color="white" />
              </HStack>
            ) : (
              iconsMenu.map((iconMenu) => {
                if (checkingPermission(iconMenu.type)) {
                  return iconMenu.icon;
                }
                return null;
              })
            )}
            {!isLoading && (
              <UserInfo
                name={user?.name}
                profilePhoto={user?.profilePic ?? undefinedPic}
                companyName={user.companyName}
                itemsList={[
                  {
                    src: "/profile",
                    label: t("Meu Perfil"),
                    _hover: {
                      bg: '#2B3D4C',
                      color: '87A3BC',
                    },
                    color: "white"
                  },
                  {
                    src: "/signin",
                    label: t("Sair"),
                    onClick: () => {
                      dispatchAuditEvent(AUDIT_EVENTS.USER_SIGNED_OUT);
                      logout(history);
                    },
                    _hover: {
                      bg: '#2B3D4C',
                      color: '87A3BC',
                    },
                    color: "white"
                  },
                ]}
              />
            )}
          </HStack>
        )}

        {/* Mobile menu button */}
        {!isDesktop && !isLoading && (
          <HStack justifyContent={"end"} w={"50%"} zIndex={10}>
            <Box cursor={"pointer"} isOpen={isOpen} onClick={toggleMenu}>
              {!isOpen ? (
                <List size={24} color="white" />
              ) : (
                <X size={24} color="white" />
              )}
            </Box>
          </HStack>
        )}
      </HStack>

      {/* Mobile menu content */}
      {!isDesktop && isOpen && !isLoading && (
        <VStack
          animation={finalAnimation}
          bgColor="#2B3D4C"
          p="20px"
          spacing={4}
          w="100vw"
          mt={"65px"}
          marginX={"16px"}
          borderRadius={"12px"}
        >
          {iconsMenu.map((iconMenu, index) => {
            if (checkingPermission(iconMenu.type)) {
              return (
                <HStack w="100%" key={index}>
                  {iconMenu.icon}
                </HStack>
              );
            }
            return null;
          })}
        </VStack>
      )}
    </>
  );
};