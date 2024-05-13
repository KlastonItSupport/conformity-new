import { HStack, VStack, useBreakpointValue } from "@chakra-ui/react";
import FormInput from "components/form-input/form-input";

export const ContactAndEmail = ({ register, errors, formValues }) => {
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  const fields = [
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Contato"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Contato *"
      width="100%"
      {...register("contact")}
      error={errors.contact?.message}
      key={"addCompany-contact"}
      defaultValue={formValues ? formValues.contact : null}
    />,
    <FormInput
      variant="auth"
      fontSize="sm"
      ms={{ base: "0px", md: "0px" }}
      type="text"
      placeholder="Email"
      margin="0 0 10px 0 "
      fontWeight="500"
      size="lg"
      borderRadius="6px"
      bgColor={"primary.50"}
      label="Email *"
      width="100%"
      {...register("email")}
      error={errors.email?.message}
      defaultValue={formValues ? formValues.email : null}
      key={"addCompany-email"}
    />,
  ];
  return isDesktop ? (
    <HStack w={"100%"}>{[...fields]}</HStack>
  ) : (
    <VStack w={"100%"}>{[...fields]}</VStack>
  );
};
