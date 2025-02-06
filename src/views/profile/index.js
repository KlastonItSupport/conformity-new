import React, { useContext, useEffect } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import { ProfileForm } from "components/forms/profile/profile";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";
import { useTranslation } from "react-i18next";
import { AuthContext } from "providers/auth";
import { AUDIT_EVENTS } from "constants/audit-events";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { dispatchAuditEvent } = useContext(AuthContext);

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.PROFILE_ACCESS);
  }, [dispatchAuditEvent]);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/profile",
      label: "Perfil",
      isCurrent: true,
    },
  ];

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Perfil")}
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
          
          <ProfileForm />
        </VStack>
      </Box>
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("profile"),
  withWarningCheck
)(ProfilePage);
