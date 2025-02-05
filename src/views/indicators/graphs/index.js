import React, { useContext, useEffect, useState } from "react";
import { NavBar } from "components/navbar";
import { Box, HStack, VStack } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { AuthContext } from "providers/auth";
import Filters from "./components/filters";
import GraphContainer from "./components/graph-container";
import ItemGraphTable from "./components/item-graph-table";
import { IndicatorsAnswerContext } from "providers/indicator-answer";
import { useBreakpoint } from "hooks/usebreakpoint";
import withWarningCheck from "hoc/with-warning-check";
import withAuthenticated from "hoc/with-authenticated";
import { compose } from "recompose";
import { TopNavigation } from "components/top-navigation";
import { useTranslation } from "react-i18next";
import Wrapper from "components/wrapper";

const GraphsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { isMobile } = useBreakpoint();
  const [titles, setTitles] = useState({
    department: "",
    dataType: "",
    frequency: "",
    id: "",
  });
  const queryParams = useQuery();
  const id = queryParams.get("id");

  const { getIndicatorsAnswers, indicatorsAnswers } = useContext(
    IndicatorsAnswerContext
  );

  const { userPermissions, userAccessRule } = useContext(AuthContext);

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

  useEffect(() => {
    const id = queryParams.get("id");
    const department = queryParams.get("department");
    const dataType = queryParams.get("dataType");
    const frequency = queryParams.get("frequency");

    setTitles({
      department,
      dataType,
      frequency,
      id,
    });

    getIndicatorsAnswers(
      id,
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      1000
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Gráficos")}
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
            <Filters
              showDepartament={!id}
              id={id}
              titles={titles}
              setTitles={setTitles}
            />
          </Box>

          <Box 
            w="100%" 
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
            p={4}
          >
            <GraphContainer title={titles} indicatorsAnswers={indicatorsAnswers} />
          </Box>

          <Box 
            w="100%" 
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
          >
            <ItemGraphTable
              indicatorsAnswers={indicatorsAnswers}
              id={id}
              title={titles}
            />
          </Box>
        </VStack>
      </Box>
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("indicators"),
  withWarningCheck
)(GraphsPage);
