import { HStack, Text, VStack } from "@chakra-ui/react";
import { Minus, Plus } from "@phosphor-icons/react";
import React from "react";
import { ButtonPrimary } from "components/button-primary";

const ToggleArrow = ({
  title,
  table,
  onAdd,
  canAdd,
  isShowing,
  setIsShowing,
}) => {
  // const [isShowing, setIsShowing] = useState(false);

  return (
    <VStack
      align="start"
      bgColor={"white"}
      border={"1px solid #ddd"}
      p={"20px"}
      mt={"20px"}
      w={"100%"}
    >
      <HStack w={"100%"} justifyContent={"space-between"}>
        <Text fontSize={{ lg: "20px", md: "19px", sm: "18px" }}>{title}</Text>
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
        <HStack w={"100%"} justifyContent={"flex-end"}>
          <ButtonPrimary
            fontSize="sm"
            fontWeight="bold"
            bgColor={"primary.100"}
            _hover={{ bgColor: "primary.200" }}
            textColor={"white"}
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
            borderRadius="7px"
            _active={{ bgColor: "primary.200" }}
            label={"Adicionar"}
            padding={"5px"}
            w={"100px"}
            h="40px"
            type="submit"
            onClick={onAdd}
            disabled={!canAdd}
          />
        </HStack>
      )}
      {isShowing && (
        <VStack style={{ overflow: "hidden", width: "100%" }}>{table}</VStack>
      )}
    </VStack>
  );
};

export default ToggleArrow;
