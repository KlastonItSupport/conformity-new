import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavBar } from "components/navbar";
import { HStack, VStack, useBreakpoint } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";

import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { AuthContext } from "providers/auth";
import Filters from "./components/filters";
import GraphContainer from "./components/graph-container";
import { Line } from "react-chartjs-2";
import ItemGraphTable from "./components/item-graph-table";

const GraphsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();
  const categoryRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const { userPermissions, userAccessRule, checkPermissionForAction } =
    useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/indicators",
      label: "Indicadores",
      isCurrent: false,
    },
    {
      path: "/indicators/graph-items",
      label: "Gráficos",
      isCurrent: true,
    },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, userAccessRule]); // Atualiza os ícones quando userPermissions muda

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} padding={"0px"} />
        <HStack justify={"start"} w={"95vw"} py={"20px"}></HStack>
        <Filters />
        <GraphContainer />
        <ItemGraphTable />
      </VStack>
    </>
  );
};

export default GraphsPage;
