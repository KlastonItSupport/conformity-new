import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addCompanySchema } from "./schema";
import FormInput from "components/form-input/form-input";
import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import { CompanyContext } from "providers/company";
import { useContext } from "react";
import {
  CityAndNeighborhood,
  ComplementAndState,
  ContactAndEmail,
  SpaceLimitAndUsersLimit,
  StatusAndLimitGeralUsers,
  StreetAndNumber,
  ZipeCodeAndCelphone,
} from "./fields/fields";

export const CompanyForm = ({
  formRef,
  onCloseModal,
  formValues,
  event = "add",
}) => {
  const { addCompany, editCompany } = useContext(CompanyContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addCompanySchema),
  });

  const onSubmit = async (data) => {
    if (event === "add") {
      const hasBeenAdded = await addCompany(data);
      if (hasBeenAdded) {
        onCloseModal();
      }
      return;
    }

    const hasBeenEdited = await editCompany(formValues.id, data);
    if (hasBeenEdited) {
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
        defaultValue={formValues ? formValues.name : null}
      />
      {!isDesktop && (
        <VStack>
          <ContactAndEmail
            errors={errors}
            register={register}
            formValues={formValues}
          />
          <CityAndNeighborhood
            errors={errors}
            register={register}
            formValues={formValues}
          />
          <StreetAndNumber
            errors={errors}
            register={register}
            formValues={formValues}
          />
          <ComplementAndState
            errors={errors}
            register={register}
            formValues={formValues}
          />
          <ZipeCodeAndCelphone
            errors={errors}
            register={register}
            formValues={formValues}
          />
          <SpaceLimitAndUsersLimit
            errors={errors}
            register={register}
            formValues={formValues}
          />
          <StatusAndLimitGeralUsers
            errors={errors}
            register={register}
            formValues={formValues}
          />
        </VStack>
      )}
      {isDesktop && (
        <>
          <HStack>
            <ContactAndEmail
              errors={errors}
              register={register}
              formValues={formValues}
            />
          </HStack>
          <HStack>
            <CityAndNeighborhood
              errors={errors}
              register={register}
              formValues={formValues}
            />
          </HStack>
          <HStack>
            <StreetAndNumber
              errors={errors}
              register={register}
              formValues={formValues}
            />
          </HStack>
          <HStack>
            <ComplementAndState
              errors={errors}
              register={register}
              formValues={formValues}
            />
          </HStack>
          <HStack>
            <ZipeCodeAndCelphone
              errors={errors}
              register={register}
              formValues={formValues}
            />
          </HStack>
          <HStack>
            <SpaceLimitAndUsersLimit
              errors={errors}
              register={register}
              formValues={formValues}
            />
          </HStack>
          <HStack>
            <StatusAndLimitGeralUsers
              errors={errors}
              register={register}
              formValues={formValues}
            />
          </HStack>
        </>
      )}{" "}
    </form>
  );
};
