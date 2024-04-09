import {
  Box,
  HStack,
  Img,
  VStack,
  keyframes,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
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
} from "@phosphor-icons/react";
import { ItemMenu } from "./components/item-menu.js";
import { UserInfo } from "./components/user-info";

const animation = keyframes`
from {top: 0px;}
to {top: 200px;}
`;

export const NavBar = () => {
  const finalAnimation = `${animation}  2s`;

  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const iconsMenu = [
    <ItemMenu
      icon={<FolderSimple size={28} />}
      itemsList={[
        {
          src: "/",
          label: "N/A",
        },
      ]}
      key={"admin-documents"}
    />,

    <ItemMenu
      icon={<House size={28} />}
      itemsList={[
        {
          src: "/",
          label: "N/A",
        },
      ]}
      key={"admin-dashboard"}
    />,
    <ItemMenu
      icon={<CheckFat size={28} />}
      itemsList={[
        {
          src: "/",
          label: "N/A",
        },
      ]}
      key={"admin-tasks"}
    />,
    <ItemMenu
      icon={<Gear size={28} />}
      itemsList={[
        {
          src: "/",
          label: "N/A",
        },
      ]}
      key={"admin-equipments"}
    />,
    <ItemMenu
      icon={<ChartLineUp size={28} />}
      itemsList={[
        {
          src: "/",
          label: "N/A",
        },
      ]}
      key={"admin-indicators"}
    />,
    <ItemMenu
      icon={<HardDrives size={28} />}
      itemsList={[
        {
          src: "/",
          label: "N/A",
        },
      ]}
      key={"admin-crm"}
    />,
    <ItemMenu
      icon={<Users size={28} />}
      itemsList={[
        {
          src: "/",
          label: "N/A",
        },
      ]}
      key={"admin-users"}
    />,
    <ItemMenu
      label={"Administração"}
      itemsList={[
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
          label: "Grupos Permissões",
        },
      ]}
      key={"admin-admin"}
    />,
  ];

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
          <Img src={whiteLogo} w={"128px"} />
        </HStack>
        {isDesktop && (
          <HStack w={"80%"} justifyContent={"flex-end"} spacing={4}>
            {[...iconsMenu]}
            <UserInfo
              name={"Gustavo Santos"}
              companyName={"Empresa Teste"}
              itemsList={[
                {
                  src: "/",
                  label: "N/A",
                },
                {
                  src: "/users",
                  label: "N/A",
                },
              ]}
            />
          </HStack>
        )}
        {!isDesktop && (
          <HStack justifyContent={"end"} w={"100%"} zIndex={10}>
            <Box cursor={"pointer"} isOpen={isOpen} onClick={toggleMenu}>
              {!isOpen ? (
                <List size={28} color="white" />
              ) : (
                <X size={28} color="white" />
              )}
            </Box>
          </HStack>
        )}
      </HStack>
      {!isDesktop && isOpen && (
        <VStack
          animation={finalAnimation}
          bgColor="#2B3D4C"
          p="20px"
          spacing={4}
          w="100vw"
          mt={"65px"}
        >
          {iconsMenu.map((item, index) => (
            <HStack w="100%" key={index}>
              {item}
            </HStack>
          ))}
        </VStack>
      )}
    </>
  );
};
