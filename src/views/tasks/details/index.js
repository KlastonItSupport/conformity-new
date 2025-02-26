import {
  Box,
  Container,
  HStack,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavBar } from "components/navbar";
import NavigationLinks from "components/navigationLinks";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Feed from "components/feed";
import { useLocation } from "react-router-dom";
import Header from "./components/header";
import NonConformityTreatment from "./components/non-conformity-treatment/non-conformity-treatment";
import { AuthContext } from "providers/auth";
import RemindersTable from "./components/reminders.table";
import PrevisionHistory from "./components/prevision-history";
import Attachments from "./components/attachments";
import EvaluatorsTasks from "./components/evaluators";
import RelatedTasks from "./components/subtasks";
import HtmlParser from "react-html-parser";
import { DetailsTaskContext } from "providers/details-task";
import withAuthenticated from "hoc/with-authenticated";
import { compose } from "recompose";
import withWarningCheck from "hoc/with-warning-check";
import withDetailsPermission from "hoc/use-task-details-permission";
import { useSidebar } from 'contexts/SidebarContext';
import Wrapper from "components/wrapper";
import { TopNavigation } from "components/top-navigation";

const TaskDetailsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canAdd, setCanAdd] = useState(false);
  const { checkPermissionForAction, userAccessRule } = useContext(AuthContext);
  const {
    getSpecificTask,
    handleTaskStatus,
    getAdditionalDocuments,
    onAddAttachments,
    deleteAttachment,
    changeTaskPrevision,
    getPrevisionsHistory,
  } = useContext(DetailsTaskContext);
  const taskId = queryParams.get("id");
  const [task, setTask] = useState(null);
  const [previsionsList, setPrevisionsList] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const { isCollapsed } = useSidebar();

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/tasks",
      label: t("Tasks"),
    },
    {
      path: "/",
      label: t("Detalhes"),
      isCurrent: true,
    },
  ];
  const isMobile = useBreakpointValue({ base: true, md: false });

  const leftContainer = (
    <Container
      w={isMobile ? "100%" : "65%"}
      h={"100%"}
      m={"0"}
      mr={isMobile ? null : "20px"}
      p={isMobile ? "0px" : 0}
      maxW={"95%"}
    >
      {task && (
        <Header
          task={task}
          setTask={setTask}
          handleStatusChange={handleTaskStatus}
          changeTaskPrevision={changeTaskPrevision}
          setPrevisionsList={(newPrevision) =>
            setPrevisionsList([...previsionsList, newPrevision])
          }
          canEdit={canEdit}
          percentage={percentage}
        />
      )}
      <RelatedTasks
        taskId={taskId}
        canDelete={canDelete}
        canEdit={canEdit}
        canAdd={canAdd}
        setPercentage={setPercentage}
      />
      <EvaluatorsTasks taskId={taskId} canAdd={canAdd} canDelete={canDelete} />
      <Attachments
        taskId={taskId}
        getAdditionalDocuments={getAdditionalDocuments}
        onAddAttachments={onAddAttachments}
        onDeleteAttachment={deleteAttachment}
        canAdd={canAdd}
        canDelete={canDelete}
      />
      <NonConformityTreatment
        canDelete={canDelete}
        canEdit={canEdit}
        canAdd={canAdd}
        taskId={taskId}
      />
      <PrevisionHistory
        getPrevisionHistory={getPrevisionsHistory}
        taskId={taskId}
        previsionsList={previsionsList}
        setPrevisionsList={setPrevisionsList}
      />
      <RemindersTable
        canDelete={canDelete}
        canEdit={canEdit}
        canAdd={canAdd}
        taskId={taskId}
      />
    </Container>
  );

  const rightContainer = task && (
    <Box
      flex={1}
      bg="white"
      borderRadius="lg"
      p={6}
      boxShadow="sm"
      w={isMobile ? "100%" : "32%"}
      ml={isMobile ? null : "20px"}
    >
      <Container
        m={"0px"}
        p={"0"}
        minH={"200px"}
        margin={"0 0px 40px 0px"}
        padding={"23px"}
        border={"1px solid #ddd"}
      >
        <Text fontSize={"20px"} color={"header.100"}>
          Título: {task.title}
        </Text>
        <Text
          fontSize={"16px"}
          color={"header.100"}
          mb={isMobile ? "20px" : "0"}
          bgColor={"white"}
        >
          {HtmlParser(task.description)}
        </Text>
      </Container>
      <Box mb={isMobile ? "20px" : "0"}>
        <Feed
          moduleId={2}
          externalId={queryParams.get("id")}
          canAdd={canAdd}
          canDelete={canDelete}
          canEdit={canEdit}
        />
      </Box>
    </Box>
  );

  const onLoad = async () => {
    const task = await getSpecificTask(queryParams.get("id"));

    setTask(task);
  };

  useEffect(() => {
    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCanDelete(checkPermissionForAction("tasks", "canDelete"));
    setCanEdit(checkPermissionForAction("tasks", "canEdit"));
    setCanAdd(checkPermissionForAction("tasks", "canAdd"));
  }, [checkPermissionForAction, userAccessRule]);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Detalhes da Tarefa")}
      />
      <Box
        marginTop="64px"
        marginLeft={isCollapsed ? "0px" : "0px"}
        transition="all 0.3s ease"
        minH="calc(100vh - 64px)"
        bg="#FAFAFA"
        p={6}
      >
        <HStack
          align="flex-start"
          
          w="100%"
        >
          {leftContainer}
          {rightContainer}
        </HStack>
      </Box>
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("tasks"),
  withWarningCheck,
  withDetailsPermission("tasks")
)(TaskDetailsPage);
