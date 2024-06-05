import { FormInput } from "components/components";
import React from "react";

const RecoverInputs = ({ register, errors }) => {
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
        {...register("name")}
        error={errors.name?.message}
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
        {...register("recover")}
        error={errors.recover?.message}
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
      />
    </>
  );
};

export default RecoverInputs;
