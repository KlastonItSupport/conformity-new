import React, { useState, useEffect, useContext } from "react";
import { NavBar } from "components/navbar";
import { Box, VStack, Spinner, Text } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import SupportForm from "./components/support-form";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";
import { useTranslation } from "react-i18next";
import { AuthContext } from "providers/auth";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { AUDIT_EVENTS } from "constants/audit-events";

const SupportPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { dispatchAuditEvent, getUserInfo, user, setUser } = useContext(AuthContext);
  
  useEffect(() => {
    const initializeUser = async () => {
      if (!user || !user.id) {
        const userInfo = getUserInfo();
        setUser(userInfo);
      }
      setIsLoading(false);
    };

    initializeUser();
    dispatchAuditEvent(AUDIT_EVENTS.SUPPORT_ACCESS);
  }, [user, getUserInfo, setUser, dispatchAuditEvent]);
  
  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/support",
      label: "Suporte",
      isCurrent: true,
    },
  ];

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Suporte")}
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
          
          {isLoading ? (
            <Box 
              w="100%" 
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              p={4}
              textAlign="center"
            >
              <Spinner />
              <Text mt={2}>{t("Carregando...")}</Text>
            </Box>
          ) : (
            <Box 
              w="100%" 
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              overflow="hidden"
              p={4}
            >
              <SupportForm />
            </Box>
          )}
        </VStack>
      </Box>
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("support"),
  withWarningCheck
)(SupportPage);
