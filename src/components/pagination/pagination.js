import { Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const Pagination = ({
  data,
  onClickPagination,
  itemsPerPage,
  currentPage,
  totalPages,
  nextPage,
  lastPage,
}) => {
  const pages = [];
  const { t } = useTranslation();

  for (let i = 1; i <= Math.ceil(data?.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const initalPage = pages[0];

  const onPageClick = (next) => {
    onClickPagination(next);
  };

  const dotsButton = () => {
    return (
      <Button
        _hover={{ bgColor: "secondaryGray.400" }}
        sx={{ borderRadius: "7px" }}
        fontWeight={"bold"}
        disabled={true}
        _disabled={{ color: "black" }}
        bgColor={"secondaryGray.400"}
        cursor={"not-allowed"}
      >
        ...
      </Button>
    );
  };

  const mountButtonPage = (page) => {
    return (
      <Button
        _hover={{ bgColor: "secondaryGray.400" }}
        sx={{ borderRadius: "7px" }}
        fontWeight={"normal"}
        key={page}
        onClick={() => onPageClick(page)}
        isActive={Number(currentPage) === page}
        bgColor={"secondaryGray.100"}
      >
        {page}
      </Button>
    );
  };
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
    <HStack padding={"20px"}>
      <Button
        _hover={{ bgColor: "secondaryGray.400" }}
        sx={{ borderRadius: "7px" }}
        fontWeight={"normal"}
        onClick={() => onPageClick(Number(currentPage) - 1)}
        disabled={Number(currentPage) === 1}
        bgColor={"secondaryGray.100"}
      >
        {t("Anterior")}
      </Button>
      {handleMiddlePages()}

      <Button
        _hover={{ bgColor: "secondaryGray.400" }}
        sx={{ borderRadius: "7px" }}
        fontWeight={"normal"}
        onClick={() => onPageClick(Number(currentPage) + 1)}
        disabled={Number(currentPage) === lastPage || lastPage === 0}
        bgColor={"secondaryGray.100"}
      >
        {t("Próximo")}
      </Button>
    </HStack>
  );
};
