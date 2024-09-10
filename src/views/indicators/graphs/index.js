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

const GraphsPage = () => {
  const [searchParams] = useSearchParams();
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
        <NavigationLinks routeTree={routeTreePaths} padding={"0px"} />
        <HStack justify={"start"} w={"95vw"} py={"20px"}></HStack>
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

export default GraphsPage;
