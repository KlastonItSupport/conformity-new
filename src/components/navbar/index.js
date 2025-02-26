import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  useBreakpointValue,
  Spinner,
  Center,
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
  CaretRight,
  CaretLeft,
  User,
  SignOut
} from "@phosphor-icons/react";
import { IoMdHelpCircle } from "react-icons/io";
import { UserInfo } from "./components/user-info";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "providers/auth";
import { useTranslation } from "react-i18next";
import undefinedPic from "assets/img/undefined-pic.png";
import { AUDIT_EVENTS } from "constants/audit-events";
import { useSidebar } from 'contexts/SidebarContext';

export const NavBar = () => {
  const { t } = useTranslation();
  const location = useLocation();
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
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const checkingPermission = (type) => {
    if (userAccessRule?.isAdmin) return true;
    if (userAccessRule?.isSuperUser && type !== "admin") return true;
    if (type === "admin") return false;
    if (type === "dashboard") return true;

    const permission = permissions[type];
    if (!permission) return false;
    
    return permission.canAdd || permission.canDelete || permission.canEdit || permission.canRead;
  };

  const menuItems = [
       {
      type: "dashboard",
      icon: House,
      label: "Dashboard",
      path: "/",
    },
    {
      type: "documents",
      icon: FolderSimple,
      label: "Documentos",
      submenu: [
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
      ],
    },
    {
      type: "tasks",
      icon: CheckFat,
      label: "Tasks",
      submenu: [
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
      ],
    },
    {
      type: "equipments",
      icon: Gear,
      label: "Equipamentos",
      submenu: [
            {
              src: "/equipments",
              label: "Equipamentos",
            },
      ],
    },
    {
      type: "indicators",
      icon: ChartLineUp,
      label: "Indicadores",
      submenu: [
            {
              src: "/indicators/graphs",
              label: "Dashboard/ Gráficos",
            },
            {
              src: "/indicators",
              label: "Indicadores",
            },
      ],
    },
    {
      type: "crm",
      icon: HardDrives,
      label: "CRM",
      submenu: [
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
      ],
    },
    {
      type: "users",
      icon: Users,
      label: "Treinamentos",
      submenu: [
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
      ],
    },
    {
      type: "companies",
      icon: Buildings,
      label: "Empresas",
      submenu: [
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
      ],
    },
    {
      type: "admin",
      icon: CaretRight,
      label: "Administração",
      submenu: [
            {
              src: "/companies",
          label: "Empresas",
            },
            {
              src: "/users",
          label: "Usuários",
            },
            {
              src: "/groups",
          label: "Grupos e Permissões",
            },
            {
              src: "/companies/blog",
          label: "Blog",
            },
            {
              src: "/companies/blog-categories",
          label: "Categorias do Blog",
        },
      ],
    },
  ];

   const SidebarMenuItem = ({ item, isCollapsed }) => {
    const location = useLocation();
    const isActive = item.path ? location.pathname === item.path : 
                    item.submenu?.some(subitem => location.pathname === subitem.src);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(isActive);

    useEffect(() => {
      if (item.submenu) {
        setIsSubmenuOpen(item.submenu.some(subitem => location.pathname === subitem.src));
      }
    }, [location.pathname, item.submenu]);

    if (item.submenu) {
      return (
        <VStack spacing={0} align="stretch" w="100%">
          <Tooltip label={isCollapsed ? t(item.label) : ""} placement="right">
            <Box
              w="100%"
              py={2}
              px={isCollapsed ? 2 : 4}
              borderRadius="sm"
              bg={isActive || isSubmenuOpen ? "rgba(255, 255, 255, 0.1)" : "transparent"}
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              cursor="pointer"
              onClick={() => isCollapsed ? setIsCollapsed(false) : setIsSubmenuOpen(!isSubmenuOpen)}
            >
              <HStack spacing={isCollapsed ? 0 : 3} justify={isCollapsed ? "center" : "flex-start"}>
                <Center w={isCollapsed ? "full" : "auto"}>
                  <Icon as={item.icon} boxSize={5} color="white" />
                </Center>
                {!isCollapsed && (
                  <>
                    <Text fontSize="sm" color="white" flex={1}>{t(item.label)}</Text>
                    <CaretRight
                      size={16}
                      color="white"
                      style={{
                        transform: isSubmenuOpen ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s ease-in-out'
                      }}
                    />
                  </>
                )}
              </HStack>
            </Box>
          </Tooltip>
          
          {!isCollapsed && (
            <VStack
              spacing={0}
              align="stretch"
              opacity={isSubmenuOpen ? 1 : 0}
              maxHeight={isSubmenuOpen ? "500px" : "0"}
              overflow="hidden"
              transition="all 0.2s ease-in-out"
            >
              {item.submenu.map((subitem) => {
                const isSubitemActive = location.pathname === subitem.src;
                return (
                  <HStack
                    key={subitem.src}
                    py={2}
                    px={6}
                    cursor="pointer"
                    bg={isSubitemActive ? "rgba(255, 255, 255, 0.1)" : "transparent"}
                    _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                    onClick={() => navigate(subitem.src)}
                  >
                    <Text fontSize="sm" color="white">
                      {t(subitem.label)}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          )}
        </VStack>
      );
    }

    return (
      <Tooltip label={isCollapsed ? t(item.label) : ""} placement="right">
        <Box
          py={2}
          px={isCollapsed ? 2 : 4}
          cursor="pointer"
          borderRadius="md"
          bg={isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"}
          _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
          onClick={() => navigate(item.path)}
          w="100%"
        >
          <HStack spacing={isCollapsed ? 0 : 3} justify={isCollapsed ? "center" : "flex-start"}>
            <Center w={isCollapsed ? "full" : "auto"}>
              <Icon as={item.icon} boxSize={5} color="white" />
            </Center>
            {!isCollapsed && <Text fontSize="sm" color="white">{t(item.label)}</Text>}
          </HStack>
        </Box>
      </Tooltip>
    );
  };

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
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isDesktop && !event.target.closest('#sidebar') && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktop, isOpen]);

  return (
    <Box
      id="sidebar"
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w={isCollapsed ? "60px" : "240px"}
      bg="#3b5366"
      color="white"
      boxShadow="lg"
      zIndex={1000}
      transition="width 0.3s ease"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
        },
      }}
    >
      <VStack h="100%" justify="space-between" p={4}>
        <VStack w="100%" spacing={6} align="stretch">
          <HStack justify="space-between" align="center" px={2}>
            {!isCollapsed && (
              <Image 
                src={whiteLogo}
                alt="Logo" 
                h="32px" 
                cursor="pointer"
                onClick={() => navigate("/")}
              />
            )}
            <Box
              cursor="pointer"
              onClick={toggleCollapse}
              p={2}
              borderRadius="md"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            >
              <CaretLeft 
                size={20} 
                color="white"
                style={{ 
                  transform: isCollapsed ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s ease'
                }}
              />
            </Box>
          </HStack>

          {isLoading ? (
            <HStack justify="center" py={4}>
              <Spinner color="white" />
              {!isCollapsed && (
                <Text color="white">Carregando permissões</Text>
              )}
            </HStack>
          ) : (
            <VStack spacing={2} align="stretch">
              {menuItems.map((item) => (
                checkingPermission(item.type) && (
                  <SidebarMenuItem 
                    key={item.type} 
                    item={item} 
                    isCollapsed={isCollapsed}
                  />
                )
              ))}
            </VStack>
          )}
        </VStack>

        <VStack w="100%" spacing={4}>
          {!isLoading && (
            <VStack w="100%" spacing={2}>
              <Tooltip label={isCollapsed ? t("Suporte") : ""} placement="right">
                <Box
                  w="100%"
                  py={2}
                  px={isCollapsed ? 2 : 4}
                  cursor="pointer"
                  borderRadius="md"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  onClick={() => navigate("/support")}
                >
                  <HStack spacing={isCollapsed ? 0 : 3} justify={isCollapsed ? "center" : "flex-start"}>
                    <Center w={isCollapsed ? "full" : "auto"}>
                      <Icon as={IoMdHelpCircle} boxSize={5} color="white" />
                    </Center>
                    {!isCollapsed && <Text fontSize="sm" color="white">{t("Suporte")}</Text>}
                  </HStack>
                </Box>
              </Tooltip>

              <Tooltip label={isCollapsed ? t("Meu Perfil") : ""} placement="right">
                <Box
                  w="100%"
                  py={2}
                  px={isCollapsed ? 2 : 4}
                  cursor="pointer"
                  borderRadius="md"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  onClick={() => navigate("/profile")}
                >
                  <HStack spacing={isCollapsed ? 0 : 3} justify={isCollapsed ? "center" : "flex-start"}>
                    <Center w={isCollapsed ? "full" : "auto"}>
                      <Avatar size="sm" src={user?.profilePic ?? undefinedPic} />
                    </Center>
                    {!isCollapsed && (
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="white">{user?.name}</Text>
                        <Text fontSize="xs" color="gray.300">{user?.companyName}</Text>
                      </VStack>
                    )}
                  </HStack>
                </Box>
              </Tooltip>

              <Tooltip label={isCollapsed ? t("Sair") : ""} placement="right">
                <Box
                  w="100%"
                  py={2}
                  px={isCollapsed ? 2 : 4}
                  cursor="pointer"
                  borderRadius="md"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  onClick={() => {
                    dispatchAuditEvent(AUDIT_EVENTS.USER_SIGNED_OUT);
                    logout(history);
                  }}
                >
                  <HStack spacing={isCollapsed ? 0 : 3} justify={isCollapsed ? "center" : "flex-start"}>
                    <Center w={isCollapsed ? "full" : "auto"}>
                      <Icon as={SignOut} boxSize={5} color="white" />
                    </Center>
                    {!isCollapsed && <Text fontSize="sm" color="white">{t("Sair")}</Text>}
                  </HStack>
                </Box>
              </Tooltip>
            </VStack>
          )}
        </VStack>
      </VStack>

      {!isDesktop && (
        <Box
          position="fixed"
          top={4}
          right={4}
          cursor="pointer"
          onClick={toggleMenu}
          zIndex={1001}
        >
          {!isOpen ? (
            <List size={24} color="white" />
          ) : (
            <X size={24} color="white" />
          )}
        </Box>
      )}
    </Box>
  );
};