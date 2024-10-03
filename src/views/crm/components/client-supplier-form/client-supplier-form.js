import { VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm, useWatch } from "react-hook-form";

import TypeStatus from "./components/type-status-inputs";
import PersonDocument from "./components/person-document-inputs";
import SocialContact from "./components/social-contact";
import Registrations from "./components/registration-inputs";
import EmailCelphone from "./components/email-contact-inputs";
import ZipCodeStates from "./components/zipcode-state-inputs";
import CityNeihborhood from "./components/city-neighborhood-input";
import NumberComplement from "./components/number-complement-inputs";
import { states } from "helpers/addresses";
import { useAddress } from "hooks/address";
import { cityAccordingToState } from "helpers/addresses";

const equipmentSchema = Yup.object().shape({
  status: Yup.string(),
  clientType: Yup.string(),
  socialReason: Yup.string(),
  fantasyName: Yup.string(),
  cnpjCpf: Yup.string(),
  passport: Yup.string(),
  nacionality: Yup.string(),
  password: Yup.string(),
  citySubscription: Yup.string(),
  stateSubscription: Yup.string(),
  contact: Yup.string(),
  email: Yup.string().email("Email inválido"),
  celphone: Yup.string(),
  cep: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  address: Yup.string(),
  number: Yup.string(),
  addressComplement: Yup.string(),
  supplier: Yup.boolean(),
  client: Yup.boolean(),
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
  const { zipCodeDetails } = useAddress();
  const cepRef = useRef();

  const [statesOptions] = useState(
    states.map((state) => {
      return {
        label: state.initials,
        value: state.initials,
      };
    })
  );
  const [cityOptions, setCityOptions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({ resolver: yupResolver(equipmentSchema) });

  const cepWatchedValue = useWatch({
    control,
    name: "cep",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    if (event === "add") {
      const res = await onAdd(data);
      setLoading(false);
      onClose(res);
      return;
    }

    const res = await onEdit({ ...data, id: id });
    setLoading(false);
    onClose(res);
  };

  useEffect(() => {
    if (!formValues) {
      setValue("status", "Ativo");
      setValue("type", "cliente");
      setValue("clientType", "cliente");
      setValue("personType", "juridica");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cepWatchedValue) return;
    if (cepWatchedValue && cepWatchedValue.length !== 9) return;
    zipCodeDetails(cepWatchedValue).then((addressDetails) => {
      const citiesOptions = cityAccordingToState.estados
        .find((state) => state.sigla === addressDetails.stateInitials)
        .cidades.map((city) => {
          return {
            label: city,
            value: city,
          };
        });

      setCityOptions(citiesOptions);
      setValue("neighborhood", addressDetails.neighborhood);
      setValue("city", addressDetails.city);
      setValue("state", addressDetails.stateInitials);
      setValue("cep", cepWatchedValue);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepWatchedValue]);

  useEffect(() => {
    if (event === "edit") {
      setValue("state", formValues.state);
      const citiesOptions = cityAccordingToState.estados
        .find((state) => state.sigla === formValues.state)
        .cidades.map((city) => {
          return {
            label: city,
            value: city,
          };
        });
      setCityOptions(citiesOptions);
      setValue("city", "Praia Grande");
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
        setValue={setValue}
        cepRef={cepRef}
        control={control}
      />

      <FormInput
        label={"Senha * "}
        {...register("password")}
        type={"password"}
        error={errors.password?.message}
        defaultValue={formValues?.password}
        placeHolder="Ex: M!nh@SENH@"
      />
      <FormInput
        label={"Nome * "}
        {...register("fantasyName")}
        error={errors.fantasyName?.message}
        defaultValue={formValues?.fantasyName}
        placeHolder="Ex: Klaston Management"
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
        setValue={setValue}
        statesOptions={statesOptions}
        cityOptions={cityOptions}
        setCityOptions={setCityOptions}
      />
      <CityNeihborhood
        register={register}
        errors={errors}
        formValues={formValues}
        cityOptions={cityOptions}
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
