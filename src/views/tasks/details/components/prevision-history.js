import { HStack, Text, VStack } from "@chakra-ui/react";
import { Minus, Plus } from "@phosphor-icons/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PrevisionHistory = ({
  getPrevisionHistory,
  taskId,
  previsionsList,
  setPrevisionsList,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPrevisionHistory(taskId).then((res) => {
      setIsLoading(false);
      setPrevisionsList(res);
    });
  }, []);

  const [isShowing, setIsShowing] = useState(false);
  const prevision = ({
    oldDate,
    userName,
    newDate,
    description,
    createdAt,
  }) => {
    return (
      <VStack
        alignItems={"start"}
        borderBottom={"2px solid #ddd"}
        p={"10px 0px"}
      >
        <Text fontWeight={"bold"}>
          {moment.utc(createdAt).format("DD/MM/YYYY HH:mm")} Alterada por{" "}
          <Text as={"span"} color={"red"}>
            {userName}.
          </Text>
        </Text>
        <Text>
          De: {moment.utc(oldDate).format("DD/MM/YYYY")} para:{" "}
          {moment.utc(newDate).format("DD/MM/YYYY")}
        </Text>
        <Text>{description}</Text>
      </VStack>
    );
  };
  return (
    <VStack
      alignItems={"start"}
      bgColor={"white"}
      border={"1px solid #ddd"}
      p={"20px"}
      mt={"20px"}
      mb={"20px"}
    >
      <HStack w={"100%"} justifyContent={"space-between"}>
        <Text fontSize={{ sm: "19px", md: "20px", lg: "24px" }}>
          Histórico de alterações de previsão
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
          {previsionsList.map((item) => {
            return prevision(item);
          })}
          {previsionsList.length === 0 && (
            <Text fontSize={"16px"}>
              Ainda não foram feitas alterações na previsão
            </Text>
          )}
        </motion.div>
      )}
    </VStack>
  );
};

export default PrevisionHistory;
