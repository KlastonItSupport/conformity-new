import {
  Heading,
  Image,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import illustration from "assets/img/auth/notebook-design.png";
import { useTranslation } from "react-i18next";

export const RightSideMessage = () => {
  const { t } = useTranslation();
  const isDesktop = useBreakpointValue({ base: false, md: false, lg: true });

  return (
    <VStack w={{ lg: "50%", md: "90%", sm: "90%" }} alignItems={"start"}>
      <Heading
        mt={{ lg: "15vh", md: "10vh", sm: "10vh" }}
        color="navy.700"
        fontSize={{ lg: "36px", md: "32px", sm: "24px" }}
      >
        {t("Seja bem-vindo ao Conformity!")}
      </Heading>
      <Text mt="10px" color="gray.600" fontWeight="400">
        {t("A solução mais completa e segura em gestão administrativa.")}
      </Text>
      {isDesktop && <Image src={illustration} />}
    </VStack>
  );
};
