import { Button, HStack } from "@chakra-ui/react";
import { useState } from "react";

export const Pagination = ({
  data,
  onClickPagination,
  itemsPerPage,
  currentPage,
}) => {
  const pages = [];

  for (let i = 1; i <= Math.ceil(data?.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const totalPages = pages[pages.length - 1];
  const initalPage = pages[0];

  const onPageClick = (page) => {
    onClickPagination(page);
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
        isActive={currentPage === page}
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
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageButtons.push(mountButtonPage(i));
      }
      pageButtons.push(dotsButton());
      pageButtons.push(mountButtonPage(totalPages));
    } else if (currentPage > totalPages - 2) {
      pageButtons.push(mountButtonPage(1));
      pageButtons.push(dotsButton());
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageButtons.push(mountButtonPage(i));
      }
    } else {
      pageButtons.push(mountButtonPage(1));
      pageButtons.push(dotsButton());
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
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
        onClick={() => onPageClick(currentPage - 1)}
        disabled={currentPage === 1}
        bgColor={"secondaryGray.100"}
      >
        Anterior
      </Button>
      {handleMiddlePages()}

      <Button
        _hover={{ bgColor: "secondaryGray.400" }}
        sx={{ borderRadius: "7px" }}
        fontWeight={"normal"}
        onClick={() => onPageClick(currentPage + 1)}
        disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
        bgColor={"secondaryGray.100"}
      >
        Próximo
      </Button>
    </HStack>
  );
};
