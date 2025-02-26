import { Divider, Text, VStack } from "@chakra-ui/react";
import { ButtonPrimary } from "components/button-primary";
import { FormTextArea } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import FeedInfo from "./components/feed-info";
import { api } from "api/api";
import { FeedSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AuthContext } from "providers/auth";
import { toast } from "react-toastify";
import TextEditor from "components/text-editor-mce";
import { AUDIT_EVENTS } from "constants/audit-events";

const Feed = ({
  moduleId,
  externalId,
  canAdd = true,
  canDelete = true,
  canEdit = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedItems, setFeedItems] = useState([]);
  const { user, getToken } = useContext(AuthContext);
  const richTextRef = useRef(null);
  const [description, setDescription] = useState("");

  const { handleSubmit, setValue } = useForm({
    resolver: yupResolver(FeedSchema),
  });

  const getFeedItems = async () => {
    const response = await api.get(
      `feed?externalId=${externalId}&moduleId=${moduleId}`
    );
    setFeedItems(response.data);
  };

  const deleteFeedItem = async (id) => {
    const response = await api.delete(`feed/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event":
          moduleId === 1
            ? AUDIT_EVENTS.DOCUMENT_DETAILS_FEED_DELETED
            : AUDIT_EVENTS.TASKS_DETAILS_FEED_DELETED,
      },
    });

    if (response.status === 200) {
      toast.success("Item excluído com sucesso");
      setFeedItems(feedItems.filter((item) => item.id !== id));
    }
  };

  const updateFeedItem = async (id, data) => {
    const response = await api.patch(`feed/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event":
          moduleId === 1
            ? AUDIT_EVENTS.DOCUMENT_DETAILS_FEED_UPDATED
            : AUDIT_EVENTS.TASKS_DETAILS_FEED_UPDATED,
      },
    });

    if (response.status === 200) {
      toast.success("Item atualizado com sucesso");
      setFeedItems(
        feedItems.map((item) => (item.id === id ? response.data : item))
      );
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const res = await api.post(
      "feed",
      {
        text: description,
        moduleId,
        externalId,
        user: user.id,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event":
            moduleId === 1
              ? AUDIT_EVENTS.DOCUMENT_DETAILS_FEED_CREATED
              : AUDIT_EVENTS.TASKS_DETAILS_FEED_CREATED,
        },
      }
    );

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
        {/* <FormTextArea
          {...register("text")}
          error={errors.text?.message}
          label={"Adicionar informação neste Documento"}
        />
         */}
        <TextEditor
          value={description}
          onChange={setDescription}
          ref={richTextRef}
          menubar={false}
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
          disabled={!canAdd}
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
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </>
  );
};

export default Feed;
