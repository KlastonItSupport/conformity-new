import { CustomTable } from "components/components";

import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavBar } from "components/navbar";
import { Flex, VStack, useBreakpoint, Box } from "@chakra-ui/react";
import NavigationLinks from "components/navigationLinks";
import { Pagination } from "components/components";

import { useSearchParams } from "react-router-dom";
import { useQuery } from "hooks/query";
import { debounce } from "lodash";
import Filters from "./components/filter";
import { MatrizContext } from "providers/matriz";
import { compose } from "recompose";
import withAuthenticated from "hoc/with-authenticated";
import withWarningCheck from "hoc/with-warning-check";
import { AUDIT_EVENTS } from "constants/audit-events";
import { AuthContext } from "providers/auth";
import { TopNavigation } from "components/top-navigation";
import Wrapper from "components/wrapper";

const MatrizPage = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useQuery();

  const [trainings, setTrainings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [columns, setColumns] = useState([]);

  const { getMatriz, handleTableColumns } = useContext(MatrizContext);
  const { dispatchAuditEvent } = useContext(AuthContext);

  const routeTreePaths = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/trainings/matriz",
      label: "Matriz",
      isCurrent: true,
    },
  ];

  useEffect(() => {
    dispatchAuditEvent(AUDIT_EVENTS.TRAININGS_MATRIX_LIST);
    getMatriz(
      searchParams.get("page") ?? 1,
      searchParams.get("search") ?? ""
    ).then((res) => {
      setTrainings(res.usersTrainings);
      setPagination(res.pages);
      setColumns(handleTableColumns(res.columnsName, setColumns));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = async (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
    const res = await getMatriz(page, queryParams.get("search") ?? "");
    setPagination(res.pages);
    setTrainings(res.usersTrainings);
  };

  const debouncedSearch = debounce(async (inputValue) => {
    if (inputValue.length >= 1 || !inputValue.length) {
      searchParams.set("search", inputValue);
      searchParams.set("page", 1);

      setSearchParams(searchParams);
      const res = await getMatriz(
        searchParams.get("page") ?? 1,
        searchParams.get("search") ?? ""
      );

      setPagination(res.pages);
      setTrainings(res.usersTrainings);
    }
  }, 500);

  return (
    <Wrapper routeTreePaths={routeTreePaths}>
      <NavBar />
      <TopNavigation 
        pageTitle={t("Matriz")}
      />
      <Box
        marginTop="64px"
        w="100%"
        px={6}
      >
        <VStack 
          spacing={3}
          w="100%"
          align="stretch"
        >
          <Box>
            <NavigationLinks routeTree={routeTreePaths} />
          </Box>

          <Box>
            <Filters
              setTrainings={setTrainings}
              setPagination={setPagination}
              setColumns={setColumns}
            />
          </Box>
          
          <Box 
            w="100%" 
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
          >
            {columns.length > 0 && (
              <CustomTable
                data={trainings}
                columns={columns}
                title={t("")}
                searchInputValue={searchParams.get("search") ?? ""}
                onChangeSearchInput={(e) => debouncedSearch(e.target.value)}
                iconsHasMaxW={true}
                onCheckItems={(show) => {}}
              />
            )}
            {pagination && (
              <Box 
                p={4} 
                borderTop="1px solid" 
                borderColor="gray.100"
              >
                <Pagination
                  data={trainings}
                  onClickPagination={updateData}
                  itemsPerPage={5}
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                  nextPage={pagination.next}
                  lastPage={pagination.last}
                />
              </Box>
            )}
          </Box>
        </VStack>
      </Box>
    </Wrapper>
  );
};

export default compose(
  withAuthenticated("training"),
  withWarningCheck
)(MatrizPage);
