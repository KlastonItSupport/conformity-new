import { VStack, HStack, Box, Text, Icon, Button, Progress, CircularProgress } from "@chakra-ui/react";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaFolder, FaCheck, FaGraduationCap, FaChartLine, FaCog } from "react-icons/fa";

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const routeTreePaths = [
    {
      path: "/",
      label: t("Dashboard"),
      isCurrent: true,
    }
  ];

  // Quick access items
  const quickAccessItems = [
    {
      icon: <FaFolder size={32} />,
      label: "Documents",
      path: "/documents",
    },
    {
      icon: <FaCheck size={32} />,
      label: "Tasks",
      path: "/tasks",
    },
    {
      icon: <FaGraduationCap size={32} />,
      label: "Trainings",
      path: "/trainings",
    },
    {
      icon: <FaChartLine size={32} />,
      label: "Indicators",
      path: "/indicators",
    },
    {
      icon: <FaCog size={32} />,
      label: "Equipment",
      path: "/equipments",
    },
  ];

  return (
    <>
      <NavBar />
      <Box 
        marginTop="100px" 
        w="100%" 
        h="100%" 
        padding="24px" 
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        mx={4}
      >
        <NavigationLinks routeTree={routeTreePaths} />
        
        {/* Bento Grid Layout */}
        <Box 
          display="grid" 
          gridTemplateColumns="250px 1fr 1fr 1fr"
          gap={4}
          mt={4}
        >
          {/* Quick Access Panel - Left Side */}
          <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {t("Quick Access")}
            </Text>
            <VStack spacing={3} align="stretch">
              {quickAccessItems.map((item, index) => (
                <Button
                  key={index}
                  leftIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  variant="solid"
                  colorScheme="blue"
                  justifyContent="flex-start"
                  h="48px"
                  w="100%"
                  _hover={{ bg: "blue.600", color: "white" }}
                >
                  {item.label}
                </Button>
              ))}
            </VStack>
          </Box>

          {/* General Information Panel */}
          <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {t("General Information")}
            </Text>
            <VStack align="stretch" spacing={3}>
              <HStack>
                <Text fontWeight="medium">Company:</Text>
                <Text>Company Name</Text>
              </HStack>
              <HStack>
                <Text fontWeight="medium">Group:</Text>
                <Text>Group Name</Text>
              </HStack>
              <HStack>
                <Text fontWeight="medium">Department:</Text>
                <Text>Department Name</Text>
              </HStack>
              <HStack>
                <Text fontWeight="medium">Role:</Text>
                <Text>User Role</Text>
              </HStack>
              <HStack>
                <Text fontWeight="medium">User:</Text>
                <Text>Username</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Licenses Panel */}
          <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {t("Licenses")}
            </Text>
            <VStack align="stretch" spacing={4}>
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text>{t("Contracted Licenses")}</Text>
                  <Text fontWeight="medium">10</Text>
                </HStack>
                <Progress 
                  value={100} 
                  size="lg" 
                  borderRadius="md"
                  w="100%"
                  colorScheme="blue"
                />
              </Box>
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text>{t("Used Licenses")}</Text>
                  <Text fontWeight="medium">5</Text>
                </HStack>
                <Progress 
                  value={50} 
                  size="lg" 
                  borderRadius="md"
                  w="100%"
                  colorScheme="red"
                />
              </Box>
            </VStack>
          </Box>

          {/* Disk Space Panel */}
          <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {t("Disk Space")}
            </Text>
            <Box position="relative" width="200px" height="200px" margin="auto">
              <CircularProgress 
                value={75} 
                size="200px"
                thickness="8px"
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
              >
                <Text fontSize="sm">{t("Used Space")}</Text>
                <Text fontSize="xl" fontWeight="bold">75%</Text>
                <VStack spacing={0} mt={1}>
                  <Text fontSize="xs" color="gray.600">{t("Used")}: 750MB</Text>
                  <Text fontSize="xs" color="gray.600">{t("Available")}: 250MB</Text>
                </VStack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashboardPage;