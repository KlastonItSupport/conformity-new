import {
  Image,
  VStack,
  useBreakpointValue,
  Box,
} from "@chakra-ui/react";
import illustration from "../../../assets/img/auth/conformity-signin.png";

export const RightSideMessage = () => {
  return (
    <Box
      w="100%"
      h="100%"
      position="relative"
    >
      <Image
        src={illustration}
        position="absolute"
        top="50%"
        left="50%"
        w="170%"
        h="170%"
        transform="translate(-50%, -50%)"
        padding={6}
        objectFit="contain"
        objectPosition="center"
        alt="Conformity Sign In"
        fallback={<Box bg="gray.100" w="100%" h="100%" />}
      />
    </Box>
  );
};
