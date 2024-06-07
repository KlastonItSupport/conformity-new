import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useRef, useState } from "react";
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
import { HStack, useDisclosure } from "@chakra-ui/react";
import { DocumentContext } from "providers/document";
import { ModalForm } from "components/components";
import CategoryForm from "components/forms/categories/create-category";
import { CategoryContext } from "providers/category";
import DepartamentForm from "components/forms/departaments/create-departament";
import { DepartamentContext } from "providers/departament";
import moment from "moment";

const DocumentForm = ({ formRef, onClose, setIsLoading }) => {
  const { t } = useTranslation();
  const categoryRef = useRef();
  const departamentRef = useRef();
  const richTextRef = useRef(null);
  const [description, setDescription] = useState("");

  const { createDocument } = useContext(DocumentContext);
  const { createCategoryIsLoading } = useContext(CategoryContext);
  const { createDepartamentIsLoading } = useContext(DepartamentContext);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(documentSchema),
  });

  const {
    isOpen: isCategoryModalOpen,
    onOpen: onCategoryModalOpen,
    onClose: onCategoryModalClose,
  } = useDisclosure();

  const {
    isOpen: isDepartamentModalOpen,
    onOpen: onDepartamentModalOpen,
    onClose: onDepartamentModalClose,
  } = useDisclosure();

  const onSubmit = async (data) => {
    setIsLoading(true);
    await createDocument({
      ...data,
      description: description,
      revisionDate: moment(data.revisionDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
    });
    setIsLoading(false);
    onClose();
  };

  return (
    <>
      <form
        style={{ width: "100%" }}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <DocumentDetailsInputs register={register} errors={errors} />
        <SelectsInputs
          register={register}
          errors={errors}
          onCategoryModalOpen={onCategoryModalOpen}
          onDepartamentModalOpen={onDepartamentModalOpen}
        />
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
      <ModalForm
        isOpen={isCategoryModalOpen}
        onClose={onCategoryModalClose}
        form={
          <CategoryForm formRef={categoryRef} onClose={onCategoryModalClose} />
        }
        formRef={categoryRef}
        title={t("Criar Categoria")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={createCategoryIsLoading}
      />
      <ModalForm
        isOpen={isDepartamentModalOpen}
        onClose={onDepartamentModalClose}
        form={
          <DepartamentForm
            formRef={departamentRef}
            onClose={onDepartamentModalClose}
          />
        }
        formRef={departamentRef}
        title={t("Criar Departamento")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Criar")}
        isLoading={createDepartamentIsLoading}
      />
    </>
  );
};

export default DocumentForm;
