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
      w={isMobile ? "95%" : "65%"}
      h={"100%"}
      m={"0"}
      minH={"200px"}
      maxW={"none"}
      p={"0px"}
      mr={"15px"}
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
    <Container
      w={isMobile ? "95%" : "35%"}
      h={"100%"}
      m={"0"}
      mr={isMobile ? null : "20px"}
      p={isMobile ? "0px" : 0}
      maxW={"none"}
    >
      <Container
        m={"0px"}
        p={"0"}
        minH={"200px"}
        margin={"0 0px 40px 0px"}
        padding={"23px"}
        border={"1px solid #ddd"}
        bgColor={"white"}
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
    </Container>
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

  return isMobile ? (
    <VStack w={"100%"} h={"100%"} marginTop={"100px"} spacing={0}>
      <NavBar />
      <NavigationLinks routeTree={routeTreePaths} />
      {rightContainer}
      {leftContainer}
    </VStack>
  ) : (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />
        <HStack w={"95vw"} h={"100%"} alignItems={"start"}>
          {leftContainer}
          {rightContainer}
        </HStack>
      </VStack>
    </>
  );
};

export default compose(
  withAuthenticated("tasks"),
  withWarningCheck
)(TaskDetailsPage);
