import { Button, HStack, useColorMode } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const Pagination = ({
  data,
  onClickPagination,
  itemsPerPage,
  currentPage,
  totalPages,
  nextPage,
  lastPage,
  hasPadding = true,
}) => {
  const { colorMode } = useColorMode();
  const pages = [];
  const { t } = useTranslation();

  for (let i = 1; i <= Math.ceil(data?.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const initalPage = pages[0];

  const onPageClick = (next) => {
    onClickPagination(next);
  };

  const dotsButton = () => (
    <Button
      size="sm"
      variant="ghost"
      disabled
      _disabled={{ opacity: 0.6 }}
      minW="7"
      h="7"
      p="1"
      fontSize="sm"
      color={colorMode === "light" ? "gray.500" : "gray.300"}
    >
      ...
    </Button>
  );

  const mountButtonPage = (page) => (
    <Button
      size="sm"
      minW="7"
      h="7"
      p="1"
      fontSize="sm"
      variant="ghost"
      color={colorMode === "light" ? "gray.600" : "gray.200"}
      _hover={{ 
        bg: colorMode === "light" ? "gray.100" : "whiteAlpha.200",
        transform: "scale(1.05)"
      }}
      _active={{
        bg: colorMode === "light" ? "gray.200" : "whiteAlpha.300",
      }}
      isActive={Number(currentPage) === page}
      onClick={() => onPageClick(page)}
    >
      {page}
    </Button>
  );

  const handleMiddlePages = () => {
    let pageButtons = [];
    if (totalPages <= 5) {
      for (let i = initalPage; i < totalPages + 1; i++) {
        pageButtons.push(mountButtonPage(i));
      }
      return pageButtons;
    }
    if (Number(currentPage) <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageButtons.push(mountButtonPage(i));
      }
      pageButtons.push(dotsButton());
      pageButtons.push(mountButtonPage(totalPages));
    } else if (Number(currentPage) > totalPages - 2) {
      pageButtons.push(mountButtonPage(1));
      pageButtons.push(dotsButton());
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageButtons.push(mountButtonPage(i));
      }
    } else {
      pageButtons.push(mountButtonPage(1));
      pageButtons.push(dotsButton());
      for (let i = Number(currentPage) - 1; i <= Number(currentPage) + 1; i++) {
        pageButtons.push(mountButtonPage(i));
      }
      pageButtons.push(dotsButton());
      pageButtons.push(mountButtonPage(totalPages));
    }

    return pageButtons;
  };

  return (
    <HStack 
      padding={hasPadding ? "12px" : "0"}
      spacing="1"
      justify="center"
      width="100%"
      bg={colorMode === "light" ? "white" : "navy.900"}
    >
      <Button
        size="sm"
        h="7"
        px="2"
        fontSize="sm"
        _hover={{ bgColor: "secondaryGray.400" }}
        sx={{ borderRadius: "7px" }}
        fontWeight="normal"
        onClick={() => onPageClick(Number(currentPage) - 1)}
        disabled={Number(currentPage) === 1}
        bgColor="secondaryGray.100"
      >
        {t("Anterior")}
      </Button>
      {handleMiddlePages()}
      <Button
        size="sm"
        h="7"
        px="2"
        fontSize="sm"
        _hover={{ bgColor: "secondaryGray.400" }}
        sx={{ borderRadius: "7px" }}
        fontWeight="normal"
        onClick={() => onPageClick(Number(currentPage) + 1)}
        disabled={Number(currentPage) === lastPage || lastPage === 0}
        bgColor="secondaryGray.100"
      >
        {t("Próximo")}
      </Button>
    </HStack>
  );
};