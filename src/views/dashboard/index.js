import { VStack, HStack, Box, Text, Icon, Button, Progress, CircularProgress } from "@chakra-ui/react";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaFolder, FaCheck, FaGraduationCap, FaChartLine, FaCog } from "react-icons/fa";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";

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
      label: t("Documents"),
      path: "/documents",
    },
    {
      icon: <FaCheck size={32} />,
      label: t("Tasks"),
      path: "/tasks",
    },
    {
      icon: <FaGraduationCap size={32} />,
      label: t("Trainings"),
      path: "/trainings",
    },
    {
      icon: <FaChartLine size={32} />,
      label: t("Indicators"),
      path: "/indicators",
    },
    {
      icon: <FaCog size={32} />,
      label: t("Equipment"),
      path: "/equipments",
    },
  ];

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation pageTitle={t("Dashboard")} />
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
     
          {/* Bento Grid Layout */}
          <Box 
            display="grid" 
            gridTemplateColumns="250px 1fr 1fr 1fr"
            gap={4}
            bg="white"
            p={6}
            mt={6}
            borderRadius="lg"
            boxShadow="sm"
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
                    onClick={() => navigate(item.path)}
                    variant="outline"
                    borderColor="#3B5366"
                    borderRadius="7px"
                    color="#3B5366"
                    bg="transparent"
                    justifyContent="center"
                    h="48px"
                    w="100%"
                    _hover={{ 
                      bg: "#3B5366",
                      color: "white"
                    }}
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
                  <Text fontWeight="medium">{t("Company")}:</Text>
                  <Text>Company Name</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="medium">{t("Group")}:</Text>
                  <Text>Group Name</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="medium">{t("Department")}:</Text>
                  <Text>Department Name</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="medium">{t("Role")}:</Text>
                  <Text>User Role</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="medium">{t("User")}:</Text>
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
                  <Box position="relative" overflow="hidden" borderRadius="md">
                    <Progress 
                      value={100} 
                      size="lg" 
                      w="100%"
                      colorScheme="blue"
                      sx={{
                        '& > div': {
                          animation: 'wave 2s ease-in-out infinite',
                          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          backgroundSize: '200% 100%',
                        }
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text>{t("Used Licenses")}</Text>
                    <Text fontWeight="medium">5</Text>
                  </HStack>
                  <Box position="relative" overflow="hidden" borderRadius="md">
                    <Progress 
                      value={50} 
                      size="lg" 
                      w="100%"
                      colorScheme="red"
                      sx={{
                        '& > div': {
                          animation: 'wave 2s ease-in-out infinite',
                          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          backgroundSize: '200% 100%',
                        }
                      }}
                    />
                  </Box>
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
        </VStack>
      </Box>
    </Wrapper>
  );
};

export default DashboardPage;