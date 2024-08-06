import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { feedSchema } from "./schema";
import { sleep } from "helpers/sleep";
import TextEditor from "components/text-editor-mce";

const FeedDescriptionForm = ({
  formRef,
  onClose,
  handleEdit,
  defaultValue,
  setIsLoading,
}) => {
  const { handleSubmit } = useForm({
    resolver: yupResolver(feedSchema),
  });

  const [description, setDescription] = useState("");
  const richTextRef = useRef(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    await sleep(250);
    await handleEdit({ text: description });
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    setDescription(defaultValue);
  }, [defaultValue]);

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <TextEditor
        value={description}
        onChange={setDescription}
        ref={richTextRef}
        menubar={false}
      />
    </form>
  );
};

export default FeedDescriptionForm;
