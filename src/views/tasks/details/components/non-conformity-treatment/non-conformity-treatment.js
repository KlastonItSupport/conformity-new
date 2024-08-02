import React, { useState } from "react";
import { HStack, Text, VStack } from "@chakra-ui/react";
import CustomRootCausesTable from "./custom-root-causes.table";
import IshikawaTable from "./ishikawa-table";
import RootCauseTable from "./root-cause.table";
import ImediateActionsTable from "./imediate-actions.table";
import CorrectiveActionsTable from "./corrective-actions.table";
import { Minus, Plus } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const NonConformityTreatment = ({ canDelete, canEdit, canAdd, taskId }) => {
  const [isShowing, setIsShowing] = useState(false);
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isShowing ? 1 : 0,
            height: isShowing ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden", width: "100%" }}
        >
          <CustomRootCausesTable
            canDelete={canDelete}
            canEdit={canEdit}
            canAdd={canAdd}
            taskId={taskId}
          />
          <IshikawaTable
            canDelete={canDelete}
            canEdit={canEdit}
            canAdd={canAdd}
            taskId={taskId}
          />
          <RootCauseTable
            canDelete={canDelete}
            canAdd={canAdd}
            canEdit={canEdit}
            taskId={taskId}
          />
          <ImediateActionsTable
            canDelete={canDelete}
            canAdd={canAdd}
            canEdit={canEdit}
            taskId={taskId}
          />
          <CorrectiveActionsTable
            canAdd={canAdd}
            canDelete={canDelete}
            canEdit={canEdit}
            taskId={taskId}
          />
        </motion.div>
      )}
    </VStack>
  );
};

export default NonConformityTreatment;
