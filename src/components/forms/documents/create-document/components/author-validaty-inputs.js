import { FormInput } from "components/components";
import React from "react";

const AuthorAndValidityInput = ({ register, errors }) => {
  return (
    <>
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: Bruno Santos"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Autor"
        width="100%"
        {...register("author")}
        error={errors.author?.message}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Ex: 12"
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Validade(Meses)"
        width="100%"
        {...register("validity")}
        error={errors.validity?.message}
      />
    </>
  );
};

export default AuthorAndValidityInput;
