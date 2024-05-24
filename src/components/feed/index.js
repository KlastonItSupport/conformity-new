import { Divider, Text, VStack } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { FormTextArea } from "components/components";
import React from "react";
import FeedInfo from "./components/feed-info";

const Feed = () => {
  const items = [
    {
      author: "Gustavo",
      date: "2020-06-25 15:50:55",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
    },
    {
      author: "Bruno",
      date: "2020-08-20 16:20:20",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
    },
    {
      author: "Jorge",
      date: "2024-05-21 16:12:23",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
    },
  ];
  return (
    <>
      <VStack
        bgColor={"#FFFFFF"}
        marginInlineStart={0}
        margin={0}
        p={"25px"}
        border={"1px solid #ddd"}
        alignItems={"start"}
      >
        <Text fontSize={"20px"} color={"header.100"}>
          Feed
        </Text>
        <Divider color={"#ddd"} />
        <FormTextArea label={"Adicionar informação neste Documento"} />

        <ButtonPrimary
          fontSize="sm"
          fontWeight="bold"
          mb="24px"
          bgColor={"primary.100"}
          _hover={{ bgColor: "primary.200" }}
          textColor={"white"}
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
          borderRadius="7px"
          _active={{ bgColor: "primary.200" }}
          type="submit"
          label={"Adicionar"}
          padding={"5px"}
          w={"100%"}
          h="40px"
        />
      </VStack>

      {items.map((item, index) => (
        <FeedInfo
          author={item.author}
          date={new Date(item.date)}
          text={item.text}
          id={index}
        />
      ))}
    </>
  );
};

export default Feed;
