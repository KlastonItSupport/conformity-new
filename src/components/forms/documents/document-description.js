import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { documentDescriptionSchema } from "./schemas/description.schema";
import TextEditor from "components/text-editor-mce";
import { api } from "api/api";
import { useLocation } from "react-router-dom";
import { AuthContext } from "providers/auth";
import { toast } from "react-toastify";
import { DetailsDocumentsContext } from "providers/details-documents";

const DocumentDescriptionForm = ({
  formRef,
  onClose,
  initialDescription,
  setIsLoading,
}) => {
  const { handleSubmit } = useForm({
    resolver: yupResolver(documentDescriptionSchema),
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const richTextRef = useRef(null);
  const { getToken } = useContext(AuthContext);
  const { description, setDescription } = useContext(DetailsDocumentsContext);
  const [provisionalDescription, setProvisionalDescription] =
    useState(description);

  const editDescription = async (description) => {
    try {
      const response = await api.patch(
        `documents/${queryParams.get("id")}`,
        { description },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (response.status === 200) {
        toast.success("Descrição  atualizado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao atualizar documento");
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    await editDescription(provisionalDescription);
    setDescription(provisionalDescription);

    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    if (initialDescription) {
      setProvisionalDescription(initialDescription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <TextEditor
        value={provisionalDescription}
        onChange={setProvisionalDescription}
        ref={richTextRef}
        menubar={true}
      />
    </form>
  );
};

export default DocumentDescriptionForm;
