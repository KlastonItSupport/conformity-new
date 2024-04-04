import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addCompanySchema } from "./schema";
import FormInput from "components/form-input/form-input";
import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import SelectInput from "components/select";
import { CompanyContext } from "providers/company";
import { useContext, useState } from "react";
import {
  CityAndNeighborhood,
  ComplementAndState,
  ContactAndEmail,
  SpaceLimitAndUsersLimit,
  StatusAndLimitGeralUsers,
  StreetAndNumber,
  ZipeCodeAndCelphone,
} from "./fields/fields";

export const CompanyForm = ({ formRef, onCloseModal }) => {
  const { addCompany } = useContext(CompanyContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addCompanySchema),
  });

  const onSubmit = async (data) => {
    const hasBeenAdded = await addCompany(data);
    if (hasBeenAdded) {
      onCloseModal();
    }
  };

  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  return (
    <form
      style={{ width: "100%" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
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
      />
      {!isDesktop && (
        <VStack>
          <ContactAndEmail errors={errors} register={register} />
          <CityAndNeighborhood errors={errors} register={register} />
          <StreetAndNumber errors={errors} register={register} />
          <ComplementAndState errors={errors} register={register} />
          <ZipeCodeAndCelphone errors={errors} register={register} />
          <SpaceLimitAndUsersLimit errors={errors} register={register} />
          <StatusAndLimitGeralUsers errors={errors} register={register} />
        </VStack>
      )}
      {isDesktop && (
        <>
          <HStack>
            <ContactAndEmail errors={errors} register={register} />
          </HStack>
          <HStack>
            <CityAndNeighborhood errors={errors} register={register} />
          </HStack>
          <HStack>
            <StreetAndNumber errors={errors} register={register} />
          </HStack>
          <HStack>
            <ComplementAndState errors={errors} register={register} />
          </HStack>
          <HStack>
            <ZipeCodeAndCelphone errors={errors} register={register} />
          </HStack>
          <HStack>
            <SpaceLimitAndUsersLimit errors={errors} register={register} />
          </HStack>
          <HStack>
            <StatusAndLimitGeralUsers errors={errors} register={register} />
          </HStack>
        </>
      )}{" "}
    </form>
  );
};
