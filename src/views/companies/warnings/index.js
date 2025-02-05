import React, { useContext, useEffect, useRef } from "react";
import { NavBar } from "components/navbar";
import { Box, VStack } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import WarningsForm from "./components/form";
import withWarningCheck from "hoc/with-warning-check";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import { AUDIT_EVENTS } from "constants/audit-events";
import { AuthContext } from "providers/auth";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";
import { useTranslation } from "react-i18next";

const WarningsPage = () => {
  const formRef = useRef();
  const { dispatchAuditEvent } = useContext(AuthContext);
  const { t } = useTranslation();

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

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.COMPANY_WARNINGS_LIST);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Avisos")}
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
          
          <Box 
            w="100%" 
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
            p={4}
          >
            <WarningsForm formRef={formRef} />
          </Box>
        </VStack>
      </Box>
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("companies"),
  withWarningCheck
)(WarningsPage);
