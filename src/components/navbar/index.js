import {
  Box,
  HStack,
  Img,
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
  Bell,
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
  const finalAnimation = `${animation}  2s`;
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
        <ItemMenu
          icon={<House size={24} />}
          itemsList={[
            {
              src: "/",
              label: "N/A",
            },
          ]}
          key={"admin-dashboard"}
        />
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
        w={"100%"}
        bgColor={"#2B3D4C"}
        height={"65px"}
        marginBottom={"40px"}
        px={"20px"}
        position={"fixed"}
        top={0}
        zIndex={3}
      >
        <HStack w={"40%"}>
          <Img
            src={whiteLogo}
            w={"124px"}
            onClick={() => navigate("/users")}
            cursor={"pointer"}
          />
          <Box>
            <Text
              fontSize={"md"}
              color={"#87A3BC"}
              px={"15px"}
              cursor={"pointer"}
              // bgColor={"red"}
              _hover={{ color: "white" }}
              onClick={() => navigate("/support")}
            >
              Suporte
            </Text>
          </Box>
          <Notification />
        </HStack>
        {isDesktop && (
          <HStack w={"80%"} justifyContent={"flex-end"} spacing={4}>
            {isLoading ? (
              <HStack w={"80%"}>
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
                  },
                  {
                    src: "/",
                    label: t("Sair"),
                    onClick: () => {
                      dispatchAuditEvent(AUDIT_EVENTS.USER_SIGNED_OUT);
                      logout(history);
                    },
                  },
                ]}
              />
            )}
          </HStack>
        )}
        {!isDesktop && !isLoading && (
          <HStack justifyContent={"end"} w={"100%"} zIndex={10}>
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
      {!isDesktop && isOpen && !isLoading && (
        <VStack
          animation={finalAnimation}
          bgColor="#2B3D4C"
          p="20px"
          spacing={4}
          w="100vw"
          mt={"65px"}
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
