import React, { useEffect, useState } from "react";
import { HStack, Text, VStack } from "@chakra-ui/react";
import CustomRootCausesTable from "./custom-root-causes.table";
import IshikawaTable from "./ishikawa-table";
import RootCauseTable from "./root-cause.table";
import ImediateActionsTable from "./imediate-actions.table";
import CorrectiveActionsTable from "./corrective-actions.table";
import { Minus, Plus } from "@phosphor-icons/react";
import { api } from "api/api";

const NonConformityTreatment = ({ canDelete, canEdit, canAdd, taskId }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [customRootCauses, setCustomRootCauses] = useState([]);
  const [ishikawa, setIshikawa] = useState([]);
  const [rootCauses, setRootCauses] = useState([]);
  const [immediateActions, setImmediateActions] = useState([]);
  const [correctiveActions, setCorrectiveActions] = useState([]);

  const showIfHaveData = (hasData) => {
    if (isShowing) {
      return;
    }
    if (hasData) {
      setIsShowing(true);
    }
  };

  const getCustomRootCauses = async () => {
    const res = await api.get(`tasks-details/root-cause-analysis/${taskId}`);
    setCustomRootCauses(res.data);
    return res.data;
  };
  const getIshikawa = async () => {
    const res = await api.get(`tasks-details/ishikawa/${taskId}`);
    setIshikawa(res.data);
    return res.data;
  };

  const getRootCauses = async () => {
    const res = await api.get(`tasks-details/root-cause/${taskId}`);
    setRootCauses(res.data);
  };

  const getImmediateActions = async () => {
    const res = await api.get(`tasks-details/immediate-actions/${taskId}`);
    setImmediateActions(res.data);
  };

  const getCorrectiveActions = async () => {
    const res = await api.get(`tasks-details/corrective-actions/${taskId}`);
    setCorrectiveActions(res.data);
  };

  useEffect(() => {
    getCustomRootCauses();
    getIshikawa();
    getRootCauses();
    getImmediateActions();
    getCorrectiveActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const shouldOpen =
      customRootCauses.length > 0 ||
      ishikawa.length > 0 ||
      rootCauses.length > 0 ||
      immediateActions.length > 0 ||
      correctiveActions.length > 0;
    showIfHaveData(shouldOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    customRootCauses,
    ishikawa,
    rootCauses,
    immediateActions,
    correctiveActions,
  ]);

  return (
    <VStack
      align="start"
      bgColor={"white"}
      border={"1px solid #ddd"}
      p={"20px"}
      mt={"20px"}
    >
      <HStack w={"100%"} justifyContent={"space-between"}>
        <Text fontSize={{ md: "24px", base: "20px", sm: "19px", lg: "24px" }}>
          Tratamento de Não Conformidade
        </Text>
        {isShowing ? (
          <HStack onClick={() => setIsShowing(!isShowing)} cursor={"pointer"}>
            <Text fontSize={"16px"}>Mostrar menos</Text>

            <Minus
              size={20}
              color="gray.100"
              cursor={"pointer"}
              onClick={() => setIsShowing(!isShowing)}
            />
          </HStack>
        ) : (
          <HStack onClick={() => setIsShowing(!isShowing)} cursor={"pointer"}>
            <Text fontSize={"16px"}>Mostrar mais</Text>
            <Plus
              size={20}
              color="gray.100"
              cursor={"pointer"}
              onClick={() => setIsShowing(!isShowing)}
            />
          </HStack>
        )}
      </HStack>
      {isShowing && (
        <VStack style={{ overflow: "hidden", width: "100%" }}>
          <CustomRootCausesTable
            canDelete={canDelete}
            canEdit={canEdit}
            canAdd={canAdd}
            taskId={taskId}
            customRootCauses={customRootCauses}
            setCustomRootCauses={setCustomRootCauses}
          />
          <IshikawaTable
            canDelete={canDelete}
            canEdit={canEdit}
            canAdd={canAdd}
            taskId={taskId}
            ishikawa={ishikawa}
            setIshikawa={setIshikawa}
          />
          <RootCauseTable
            canDelete={canDelete}
            canAdd={canAdd}
            canEdit={canEdit}
            taskId={taskId}
            rootCauses={rootCauses}
            setRootCauses={setRootCauses}
          />
          <ImediateActionsTable
            canDelete={canDelete}
            canAdd={canAdd}
            canEdit={canEdit}
            taskId={taskId}
            immediateActions={immediateActions}
            setImmediateActions={setImmediateActions}
          />
          <CorrectiveActionsTable
            canAdd={canAdd}
            canDelete={canDelete}
            canEdit={canEdit}
            taskId={taskId}
            correctiveActions={correctiveActions}
            setCorrectiveActions={setCorrectiveActions}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default NonConformityTreatment;
