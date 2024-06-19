import { Divider, Text, VStack } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { FormTextArea } from "components/components";
import React, { useContext, useEffect, useState } from "react";
import FeedInfo from "./components/feed-info";
import { api } from "api/api";
import { FeedSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AuthContext } from "providers/auth";
import { toast } from "react-toastify";

const Feed = ({ moduleId, externalId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedItems, setFeedItems] = useState([]);
  const { user } = useContext(AuthContext);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(FeedSchema),
  });

  const getFeedItems = async () => {
    const response = await api.get("feed", {
      moduleId,
      externalId,
    });
    setFeedItems(response.data);
  };

  const deleteFeedItem = async (id) => {
    const response = await api.delete(`feed/${id}`);

    if (response.status === 200) {
      toast.success("Item excluído com sucesso");
      setFeedItems(feedItems.filter((item) => item.id !== id));
    }
  };

  const updateFeedItem = async (id, data) => {
    const response = await api.patch(`feed/${id}`, data);

    if (response.status === 200) {
      toast.success("Item atualizado com sucesso");
      setFeedItems(
        feedItems.map((item) => (item.id === id ? response.data : item))
      );
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const res = await api.post("feed", {
      ...data,
      moduleId,
      externalId,
      user: user.id,
    });

    if (res.status === 201) {
      setFeedItems([res.data, ...feedItems]);
      setValue("text", "");
      toast.success("Item adicionado com sucesso");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeedItems();
  }, []);

  return (
    <>
      <VStack
        bgColor={"#FFFFFF"}
        marginInlineStart={0}
        margin={0}
        p={"25px"}
        border={"1px solid #ddd"}
        alignItems={"start"}
        as={"form"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Text fontSize={"20px"} color={"header.100"}>
          Feed
        </Text>
        <Divider color={"#ddd"} />
        <FormTextArea
          {...register("text")}
          error={errors.text?.message}
          label={"Adicionar informação neste Documento"}
        />

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
          label={"Adicionar"}
          padding={"5px"}
          w={"100%"}
          h="40px"
          type="submit"
          isLoading={isLoading}
        />
      </VStack>

      {feedItems.map((item) => (
        <FeedInfo
          author={item.userName}
          date={item.createdAt}
          text={item.text}
          id={item.id}
          onDelete={deleteFeedItem}
          onEdit={updateFeedItem}
        />
      ))}
    </>
  );
};

export default Feed;
