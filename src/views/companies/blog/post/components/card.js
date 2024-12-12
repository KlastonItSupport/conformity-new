import { useBreakpoint } from "hooks/usebreakpoint";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import HtmlParser from "react-html-parser";

const Card = ({ post }) => {
  const { isMobile } = useBreakpoint();
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
      boxShadow="md"
      w={isMobile ? "100vw" : "95vw"}
      pb={"20px"}
      paddingX={"20px"}
    >
      <Heading size="md" mb={2}>
        {post.title}
      </Heading>
      <VStack align="start" spacing={2}>
        <Text>{HtmlParser(post.text)}</Text>
      </VStack>
    </Box>
  );
};

export default Card;
