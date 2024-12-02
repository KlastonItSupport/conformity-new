import React, { useContext, useEffect, useRef } from "react";
import { NavBar } from "components/navbar";
import { HStack, VStack } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import WarningsForm from "./components/form";
import withWarningCheck from "hoc/with-warning-check";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import { AUDIT_EVENTS } from "constants/audit-events";
import { AuthContext } from "providers/auth";

const WarningsPage = () => {
  const formRef = useRef();
  const { dispatchAuditEvent } = useContext(AuthContext);

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
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <HStack justify={"start"} w={"95vw"} py={"20px"}>
          <WarningsForm formRef={formRef} />
        </HStack>
      </VStack>
    </>
  );
};

export default compose(
  withAuthenticated("companies"),
  withWarningCheck
)(WarningsPage);
