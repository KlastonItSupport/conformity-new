import { CustomTable } from "components/components";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { columns } from "./helpers/table-helper";

import { NavBar } from "components/navbar";
import { Flex, VStack, useBreakpoint } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";

import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import { getRevisions } from "./helpers/helper";
import { AuthContext } from "providers/auth";

const RevisionsPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const { getToken } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/documents",
      label: "Documentos",
      isCurrent: false,
    },
    {
      path: "/revisions",
      label: "Revisões",
      isCurrent: true,
    },
  ];

  useEffect(() => {
    getRevisions(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? "",
      setReviews,
      getToken()
    ).then((analysisDocuments) => {
      setReviews(analysisDocuments.items);
      setPagination(analysisDocuments.pages);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    const analysisDocuments = await getRevisions(
      page,
      queryParams.get("search") ?? "",
      setReviews,
      getToken()
    );
    setReviews(analysisDocuments.items);
    setPagination(analysisDocuments.pages);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const reviews = await getRevisions(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? "",
        setReviews,
        getToken()
      );

      setReviews(reviews.items);
      setPagination(reviews.pages);
    }
  }, 500);

  return (
    <>
      <NavBar />
      <VStack marginTop={"100px"} spacing={0} w="100%" h="100%">
        <NavigationLinks routeTree={routeTreePaths} />

        <CustomTable
          data={reviews}
          columns={columns}
          title={t("Revisões cadastradas")}
          searchInputValue={searchParams.get("search") ?? ""}
          onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
          iconsHasMaxW={true}
        />
        <Flex
          justifyContent={"end"}
          w={isMobile ? "99vw" : "95vw"}
          bgColor={"white"}
        >
          {pagination && (
            <Pagination
              data={reviews}
              onClickPagination={updateData}
              itemsPerPage={10}
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              nextPage={pagination.next}
              lastPage={pagination.last}
            />
          )}
        </Flex>
      </VStack>
    </>
  );
};

export default RevisionsPage;
