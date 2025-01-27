import { FormInput } from "components/components";
import React from "react";
import { useTranslation } from "react-i18next";

const DocumentDetailsInputs = ({ register, errors, formValues, setValue }) => {
  const { t } = useTranslation();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Obtener el nombre del archivo sin la extensión
      const fileName = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      // Establecer el nombre en el campo de nombre
      setValue("name", fileName);
    }
  };

  return (
    <>
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="file"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Insira seu documento")}
        className="center-file-input"
        {...register("document", {
          onChange: handleFileChange
        })}
        multiple
        error={errors.document?.message}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Nome"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Nome *"
        width="100%"
        {...register("name")}
        error={errors.name?.message}
        defaultValue={formValues?.name}
      />
    </>
  );
};

export default DocumentDetailsInputs;
