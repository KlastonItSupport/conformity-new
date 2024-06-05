import { FormInput } from "components/components";
import React from "react";

const ReivisionAndRetentionInput = ({ register, errors }) => {
  return (
    <>
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: 2"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Revisão(Meses)"
        width="100%"
        {...register("revision")}
        error={errors.revision?.message}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: 5"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Retenção Mínima (anos)"
        width="100%"
        {...register("retention")}
        error={errors.retention?.message}
      />
    </>
  );
};

export default ReivisionAndRetentionInput;
