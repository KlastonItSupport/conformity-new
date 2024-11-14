import React, { useContext, useEffect, useState } from "react";
import { NavBar } from "components/navbar";
import { HStack, VStack } from "@chakra-ui/react";
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

const GraphsPage = () => {
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
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} paddingX={{ sm: "20px" }} />
        <HStack
          justify={"start"}
          w={isMobile ? "100vw" : "95vw"}
          paddingX={isMobile ? "20px" : 0}
          py={"20px"}
        ></HStack>
        <Filters
          showDepartament={!id}
          id={id}
          titles={titles}
          setTitles={setTitles}
        />
        <GraphContainer title={titles} indicatorsAnswers={indicatorsAnswers} />
        <ItemGraphTable
          indicatorsAnswers={indicatorsAnswers}
          id={id}
          title={titles}
        />
      </VStack>
    </>
  );
};

export default compose(
  withAuthenticated("indicators"),
  withWarningCheck
)(GraphsPage);
