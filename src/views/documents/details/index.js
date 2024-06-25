import {
  Box,
  Container,
  HStack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import React, { useContext, useEffect, useRef } from "react";
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
import { DetailsDocumentsContext } from "providers/details-documents";
import { useLocation } from "react-router-dom";
import { AuthContext } from "providers/auth";

const DocumentsDetailsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { getDocumentDetails, documentsDetails, userAccessRule } = useContext(
    DetailsDocumentsContext
  );
  const { getUserAccessRule, userPermissions } = useContext(AuthContext);
  const queryParams = new URLSearchParams(location.search);
  const showFeed = useRef(null);
  const documentId = queryParams.get("id");

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/documents",
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
      w={isMobile ? "100%" : "32%"}
      h={"100%"}
      m={"0"}
      mr={isMobile ? null : "20px"}
      p={isMobile ? "0px" : 0}
      maxW={"95%"}
    >
      {documentsDetails && documentsDetails.document && (
        <DocumentsDetails
          userPermissions={userPermissions}
          document={documentsDetails.document}
          userAccessRule={userAccessRule}
        />
      )}
      <Container padding={"0 0 30px 0"}></Container>
      {showFeed.current && (
        <Feed moduleId={1} externalId={queryParams.get("id")} />
      )}
    </Container>
  );

  useEffect(() => {
    if (documentId) {
      getDocumentDetails(documentId);
      getUserAccessRule().then((rules) => {
        showFeed.current = rules.isAdmin || rules.isSuperUser;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        {isMobile ? (
          <VStack w={"100%"} h={"100%"} paddingX={"10px"}>
            {leftContainer}
            <Container h={"100%"} p={0} m={"0"} maxW={"none"}>
              {documentsDetails && documentsDetails.document && <Description />}
              <Revisions />
              <Evaluators documentId={documentId} />
              <RelatedDocuments documentId={documentId} />
              <DepartamentPermissions documentId={documentId} />
            </Container>
          </VStack>
        ) : (
          <HStack w={"95vw"} h={"100%"} alignItems={"start"}>
            {leftContainer}
            <Box h={"100%"} overflow={"auto"}>
              {documentsDetails && documentsDetails.document && <Description />}
              <Revisions />
              <Evaluators documentId={documentId} />
              <RelatedDocuments documentId={documentId} />
              <DepartamentPermissions documentId={documentId} />
              <Container padding={"0 0 30px 0"}></Container>
            </Box>
          </HStack>
        )}
      </VStack>
    </>
  );
};

export default DocumentsDetailsPage;
