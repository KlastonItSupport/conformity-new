import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavBar } from "components/navbar";
import { HStack, VStack, useBreakpoint } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { AuthContext } from "providers/auth";
import WarningsForm from "./components/form";

const WarningsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const { userPermissions, userAccessRule } = useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },

    {
      path: "/companies/warnings",
      label: "Avisos",
      isCurrent: true,
    },
  ];

  useEffect(() => {}, [userPermissions, userAccessRule]); // Atualiza os ícones quando userPermissions muda

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <HStack justify={"start"} w={"95vw"} py={"20px"}>
          <WarningsForm />
        </HStack>
      </VStack>
    </>
  );
};

export default WarningsPage;
