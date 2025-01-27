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
      try {
        setIsLoading(true);
        const id = getIdFromQuery();
        console.log('Checking permission for ID:', id);
        
        if (!id) {
          console.log('No ID found in query');
          setIsAllowed(false);
          setIsLoading(false);
          return;
        }
    
        const permission = type === "documents"
          ? await checkPermissionToDetailsDocuments(id)
          : await checkPermissionToDetailsTask(id);
        
        console.log('Permission response:', permission);
        setIsAllowed(permission.isAllowed);
      } catch (error) {
        console.error('Error in handlePermission:', error);
        setIsAllowed(false);
      } finally {
        setIsLoading(false);
      }
    };

    
    useEffect(() => {
      handlePermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
