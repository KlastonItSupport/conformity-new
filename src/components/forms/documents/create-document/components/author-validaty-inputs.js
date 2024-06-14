import { FormInput } from "components/components";
import { AuthContext } from "providers/auth";
import React, { useContext } from "react";

const AuthorAndValidityInput = ({ register, errors, formValues }) => {
  const { user } = useContext(AuthContext);
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
        {...register("owner")}
        error={errors.owner?.message}
        defaultValue={formValues.owner ?? user?.name}
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
        defaultValue={formValues.validity}
      />
    </>
  );
};

export default AuthorAndValidityInput;
