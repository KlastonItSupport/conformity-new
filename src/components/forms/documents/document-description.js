import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { documentDescriptionSchema } from "./schemas/description.schema";
import TextEditor from "components/text-editor-mce";
import { api } from "api/api";
import { useLocation } from "react-router-dom";
import { AuthContext } from "providers/auth";
import { toast } from "react-toastify";
import { DetailsDocumentsContext } from "providers/details-documents";

const DocumentDescriptionForm = ({ formRef, onClose, initialDescription }) => {
  const { handleSubmit } = useForm({
    resolver: yupResolver(documentDescriptionSchema),
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const richTextRef = useRef(null);
  const { getToken } = useContext(AuthContext);
  const { description, setDescription } = useContext(DetailsDocumentsContext);

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
    editDescription(description);
    onClose();
  };

  useEffect(() => {
    if (initialDescription) {
      setDescription(initialDescription);
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
        value={description}
        onChange={setDescription}
        ref={richTextRef}
        menubar={false}
      />
    </form>
  );
};

export default DocumentDescriptionForm;
