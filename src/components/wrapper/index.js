import { Box } from "@chakra-ui/react";
import React from "react";
import { useSidebar } from 'contexts/SidebarContext';

const Wrapper = ({ children, routeTreePaths }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <Box
      position="relative"
      minH="100vh"
      w="100%"
    >
      {/* Container principal que ocupa todo el espacio */}
      <Box
        position="absolute"
        top="0" // Eliminado el espacio de 64px
        left={isCollapsed ? "76px" : "256px"} // Ajuste para el sidebar
        right="0"
        bottom="0"
        bg="#FAFAFA"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Wrapper;
