import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { documentSchema } from "../schemas/document.schema";
import { useTranslation } from "react-i18next";
import TextEditor from "components/text-editor-mce";
import DocumentDetailsInputs from "./components/document-details-inputs";
import SelectsInputs from "./components/selects-inputs";
import DatesInputs from "./components/dates-inputs";
import AuthorAndValidityInput from "./components/author-validaty-inputs";
import ReivisionAndRetentionInput from "./components/revision-and-retention-input";
import RecoverInputs from "./components/recover-inputs";
import { HStack } from "@chakra-ui/react";

const DocumentForm = ({ formRef, onClose }) => {
  const { t } = useTranslation();
  const richTextRef = useRef(null);
  const [description, setDescription] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(documentSchema),
  });

  const onSubmit = async (data) => {
    console.log("description", description);
  };

  return (
    <form
      style={{ width: "100%" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <DocumentDetailsInputs register={register} errors={errors} />
      <SelectsInputs register={register} errors={errors} />
      <DatesInputs register={register} errors={errors} setValue={setValue} />
      <HStack>
        <AuthorAndValidityInput register={register} errors={errors} />
      </HStack>
      <HStack mt={"15px"}>
        {<ReivisionAndRetentionInput register={register} errors={errors} />}
      </HStack>
      <RecoverInputs register={register} errors={errors} />
      <TextEditor
        value={description}
        onChange={setDescription}
        ref={richTextRef}
      />
    </form>
  );
};

export default DocumentForm;
