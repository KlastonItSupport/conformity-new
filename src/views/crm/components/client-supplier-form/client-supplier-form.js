import { VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { DepartamentContext } from "providers/departament";
import moment from "moment";
import { sleep } from "helpers/sleep";
import TypeStatus from "./components/type-status-inputs";
import PersonDocument from "./components/person-document-inputs";
import SocialContact from "./components/social-contact";
import Registrations from "./components/registration-inputs";
import EmailCelphone from "./components/email-contact-inputs";
import ZipCodeStates from "./components/zipcode-state-inputs";
import CityNeihborhood from "./components/city-neighborhood-input";
import NumberComplement from "./components/number-complement-inputs";

const equipmentSchema = Yup.object().shape({
  status: Yup.string(),
  clientType: Yup.string(),
  document: Yup.string(),
  password: Yup.string(),
  name: Yup.string(),
  fantasyName: Yup.string(),
  contact: Yup.string(),
  citySubscription: Yup.string(),
  stateSubscription: Yup.string(),
  email: Yup.string(),
  celphone: Yup.string(),
  zipcode: Yup.string(),
  state: Yup.string(),
  city: Yup.string(),
  neighborhood: Yup.string(),
  number: Yup.string(),
  complement: Yup.string(),
});

const ClientSupplierForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(equipmentSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      sleep(1000);
      setLoading(false);
      onClose();
      return;
    }

    console.log("b0", data.departamentId);
    await onEdit();
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    if (!formValues) {
      setValue("status", "Ativo");
      setValue("type", "client");
      setValue("clientType", "juridica");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      <TypeStatus register={register} errors={errors} formValues={formValues} />
      <PersonDocument
        register={register}
        errors={errors}
        formValues={formValues}
      />

      <FormInput
        label={"Senha * "}
        {...register("password")}
        type={"password"}
        error={errors.password?.message}
        defaultValue={formValues?.password}
      />
      <FormInput
        label={"Nome * "}
        {...register("name")}
        error={errors.name?.message}
        defaultValue={formValues?.name}
      />
      <SocialContact
        register={register}
        errors={errors}
        formValues={formValues}
      />
      <Registrations
        register={register}
        errors={errors}
        formValues={formValues}
      />
      <EmailCelphone
        register={register}
        errors={errors}
        formValues={formValues}
      />
      <ZipCodeStates
        register={register}
        errors={errors}
        formValues={formValues}
      />
      <CityNeihborhood
        register={register}
        errors={errors}
        formValues={formValues}
      />
      <NumberComplement
        register={register}
        errors={errors}
        formValues={formValues}
      />
    </VStack>
  );
};

export default ClientSupplierForm;
