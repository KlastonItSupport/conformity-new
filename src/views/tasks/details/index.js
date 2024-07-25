import {
  Box,
  Container,
  HStack,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Feed from "components/feed";
import { useLocation } from "react-router-dom";
import Header from "./components/header";
import NonConformityTreatment from "./components/non-conformity-treatment/non-conformity-treatment";
import { AuthContext } from "providers/auth";
import RemindersTable from "./components/reminders.table";
import PrevisionHistory from "./components/prevision-history";
import Attachments from "./components/attachments";
import EvaluatorsTasks from "./components/evaluators";
import RelatedTasks from "./components/related-tasks";

const TaskDetailsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const { checkPermissionForAction, userAccessRule } = useContext(AuthContext);
  const relatedTasks = [
    {
      id: 1,
      responsable: "João da Silva",
      title: "Implantação Iso 9001",
      origin: "AUDITORIA INTERNA",
      classification: "Auditorias ",
      type: "FORNECEDOR",
      createdAt: "2022-10-10",
      status: "Aberta",
      progress: 40,
    },
    {
      id: 2,
      responsable: "Bruno Santos",
      title: "Abordagem de Conformidade",
      origin: "AUDITORIA INTERNA",
      classification: "Auditorias ",
      type: "FORNECEDOR",
      createdAt: "2022-10-10",
      status: "Fechada",
      progress: 60,
    },
    {
      id: 3,
      responsable: "Maria da Silva",
      title: "Implantação Iso 9001",
      origin: "AUDITORIA INTERNA",
      classification: "Auditorias ",
      type: "FORNECEDOR",
      createdAt: "2022-10-10",
      status: "Fechada",
      progress: 100,
    },
  ];

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/tasks",
      label: t("Tasks"),
    },
    {
      path: "/",
      label: t("Detalhes"),
      isCurrent: true,
    },
  ];
  const isMobile = useBreakpointValue({ base: true, md: false });

  const taskTitle = "Implantação Iso 9001";

  const leftContainer = (
    <Container
      w={isMobile ? "95%" : "65%"}
      h={"100%"}
      m={"0"}
      minH={"200px"}
      maxW={"none"}
      p={"0px"}
      mr={"15px"}
    >
      <Header
        code={931}
        author={"João da Silva"}
        project={"Iso 9001"}
        origin={"AUDITORIA INTERNA"}
        classification={"Auditorias "}
        type={"FORNECEDOR"}
        datePrevision={"2022-10-10"}
        status={"Fechada"}
      />
      <RelatedTasks relatedTasks={relatedTasks} />
      <EvaluatorsTasks
        onAddEvaluator={() => {}}
        onDeleteEvaluator={() => {}}
        evaluators={[
          {
            id: 1,
            name: "João da Silva",
            picture:
              "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2023/07/IMG_4032.jpg?w=732&h=412&crop=1",
          },
          {
            id: 2,
            name: "Bruno Santos",
            picture:
              "https://www.agendartecultura.com.br/wp-content/uploads/2022/12/meneson.jpg",
          },
          {
            id: 3,
            name: "Maria da Silva",
            picture:
              "https://img.freepik.com/fotos-gratis/estilo-de-vida-beleza-e-moda-conceito-de-emocoes-de-pessoas-jovem-gerente-de-escritorio-feminino-asiatico-ceo-com-expressao-satisfeita-em-pe-sobre-um-fundo-branco-sorrindo-com-os-bracos-cruzados-sobre-o-peito_1258-59329.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721606400&semt=sph",
          },
        ]}
      />
      <Attachments
        attachments={[
          { name: "ISO9001.pdf", url: "" },
          { name: "Normas-Atualizadas.pdf", url: "" },
          { name: "Contratos.png", url: "" },
          { name: "Imagem.png", url: "" },
        ]}
      />
      <NonConformityTreatment canDelete={canDelete} canEdit={canEdit} />
      <PrevisionHistory />
      <RemindersTable canDelete={canDelete} canEdit={canEdit} />
    </Container>
  );

  const rightContainer = (
    <Container
      w={isMobile ? "95%" : "35%"}
      h={"100%"}
      m={"0"}
      mr={isMobile ? null : "20px"}
      p={isMobile ? "0px" : 0}
      maxW={"none"}
    >
      <Container
        m={"0px"}
        p={"0"}
        border={"1px solid #ddd"}
        minH={"200px"}
        bgColor={"white"}
        margin={"0 0px 40px 0px"}
        padding={"23px"}
      >
        <Text fontSize={"20px"} color={"header.100"}>
          Título: {taskTitle}
        </Text>
        <Text
          fontSize={"16px"}
          color={"header.100"}
          mb={isMobile ? "20px" : "0"}
        >
          Iso 9001 é um padrão de qualidade de produtos e serviços que
          estabelece as normas e regulamentações para a qualidade de produtos e
          serviços de alto nível, com foco em garantir que produtos e serviços
          sejam confiáveis, confiáveis e seguros.
        </Text>
      </Container>
      <Box mb={isMobile ? "20px" : "0"}>
        <Feed
          moduleId={2}
          externalId={queryParams.get("id")}
          canAdd={true}
          canDelete={true}
          canEdit={true}
        />
      </Box>
    </Container>
  );

  useEffect(() => {
    setCanDelete(checkPermissionForAction("tasks", "canDelete"));
    setCanEdit(checkPermissionForAction("tasks", "canEdit"));
  }, [checkPermissionForAction, userAccessRule]);
  return isMobile ? (
    <VStack w={"100%"} h={"100%"} marginTop={"100px"} spacing={0}>
      <NavBar />
      <NavigationLinks routeTree={routeTreePaths} />
      {rightContainer}
      {leftContainer}
    </VStack>
  ) : (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <HStack w={"95vw"} h={"100%"} alignItems={"start"}>
          {leftContainer}
          {rightContainer}
        </HStack>
      </VStack>
    </>
  );
};

export default TaskDetailsPage;
