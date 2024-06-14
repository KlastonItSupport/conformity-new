import { FormInput } from "components/components";
import React from "react";

const RecoverInputs = ({ register, errors, formValues }) => {
  return (
    <>
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: REDE"
        margin="15px 0 0 0"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Local *"
        width="100%"
        {...register("local")}
        error={errors.local?.message}
        defaultValue={formValues.local ?? "REDE"}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: DOC#"
        margin="15px 0 0 0"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Identificação *"
        width="100%"
        {...register("identification")}
        error={errors.identification?.message}
        defaultValue={formValues.identification ?? "DOC#"}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: ACESSO NO SERVIDOR"
        margin="15px 0 0 0"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Proteção *"
        width="100%"
        {...register("protection")}
        error={errors.protection?.message}
        defaultValue={formValues.protection ?? "ACESSO NO SERVIDOR"}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: BACKUP"
        margin="15px 0 0 0"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Recuperação *"
        width="100%"
        {...register("recovery")}
        error={errors.recovery?.message}
        defaultValue={formValues.recovery ?? "BACKUP"}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: DIGITAL"
        margin="15px 0 0 0"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Disposição *"
        width="100%"
        {...register("disposition")}
        error={errors.disposition?.message}
        defaultValue={formValues.disposition ?? "DIGITAL"}
      />
    </>
  );
};

export default RecoverInputs;
