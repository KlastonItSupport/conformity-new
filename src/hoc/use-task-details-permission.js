import { useLocation } from "react-router-dom";
import { DetailsTaskContext } from "providers/details-task";
import React, { useEffect, useContext, useState } from "react";
import { Spinner, Box, Center } from "@chakra-ui/react";
import { DetailsDocumentsContext } from "providers/details-documents";

const withDetailsPermission = (type) => (WrappedComponent) => {
  return (props) => {
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { checkPermissionToDetailsTask } = useContext(DetailsTaskContext);
    const { checkPermissionToDetailsDocuments } = useContext(
      DetailsDocumentsContext
    );
    const location = useLocation();

    const getIdFromQuery = () => {
      const queryParams = new URLSearchParams(location.search);
      return queryParams.get("id");
    };

    const handlePermission = async () => {
      setIsLoading(true);
      const id = getIdFromQuery();
      if (!id) {
        setIsAllowed(false);
        setIsLoading(false);
        return;
      }
      const permission =
        type === "documents"
          ? await checkPermissionToDetailsDocuments(id)
          : await checkPermissionToDetailsTask(id);
      setIsAllowed(permission.isAllowed);
      setIsLoading(false);
    };

    useEffect(() => {
      handlePermission();
    }, [location.search]);

    if (isLoading) {
      return (
        <Center h="100vh">
          <Spinner size="xl" color="#2B3D4C" />
        </Center>
      );
    }

    if (!isAllowed) {
      return (
        <Center h="100vh">
          <Box
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="red.600"
          >
            Acesso não permitido.
          </Box>
        </Center>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withDetailsPermission;
