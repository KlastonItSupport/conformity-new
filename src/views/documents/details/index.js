import {
  Box,
  Container,
  HStack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  DepartamentPermissions,
  Description,
  DocumentsDetails,
  Evaluators,
  RelatedDocuments,
  Revisions,
} from "./components/components";
import Feed from "components/feed";

const DocumentsDetailsPage = () => {
  const { t } = useTranslation();

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/",
      label: t("Documentos"),
    },
    {
      path: "/users",
      label: t("Detalhes"),
      isCurrent: true,
    },
  ];
  const isMobile = useBreakpointValue({ base: true, md: false });

  const leftContainer = (
    <Container
      w={isMobile ? "100%" : "100%"}
      h={"100%"}
      m={"0"}
      mr={isMobile ? null : "20px"}
      p={isMobile ? "0px" : 0}
      maxW={"95%"}
    >
      <DocumentsDetails />
      <Container padding={"0 0 30px 0"}></Container>
      <Feed />
    </Container>
  );

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        {isMobile ? (
          <VStack w={"100%"} h={"100%"} paddingX={"10px"}>
            {leftContainer}
            <Container h={"100%"} p={0} m={"0"} maxW={"none"}>
              <Description
                description={
                  "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                }
              />
              <Revisions />
              <Evaluators />
              <RelatedDocuments />
              <DepartamentPermissions />
            </Container>
          </VStack>
        ) : (
          <HStack w={"95vw"} h={"100%"} alignItems={"start"}>
            {leftContainer}
            <Box h={"100%"} overflow={"auto"}>
              <Description
                description={
                  "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                }
              />
              <Revisions />
              <Evaluators />
              <RelatedDocuments />
              <DepartamentPermissions />
              <Container padding={"0 0 30px 0"}></Container>
            </Box>
          </HStack>
        )}
      </VStack>
    </>
  );
};

export default DocumentsDetailsPage;
