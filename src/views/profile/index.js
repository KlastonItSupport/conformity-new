import { Box, VStack } from "@chakra-ui/react";
import { NavBar, NavigationLinks } from "components/components";
import { ProfileForm } from "components/forms/components";
import React from "react";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();

  const routeTreePaths = [
    {
      path: "/",
      label: t("Dashboard"),
    },
    {
      path: "/profile",
      label: t("Meu Perfil"),
      isCurrent: true,
    },
  ];
  return (
    <>
      <NavBar />

      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <Box px={"20px"} w={"100%"}>
          <ProfileForm />
        </Box>
      </VStack>
    </>
  );
};

export default ProfilePage;
