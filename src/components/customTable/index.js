import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Flex,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { InteractiveButtons } from "./components/interactive-buttons";
import FormInput from "components/form-input/form-input";
import { useBreakpoint } from "hooks/usebreakpoint";
import { useTranslation } from "react-i18next";
import { MagnifyingGlass } from "@phosphor-icons/react";


const TableCustom = ({
  columns,
  data,
  title,
  onCheckItems,
  icons,
  formatOnDownLoad,
  onChangeSearchInput,
  searchInputValue,
  deskWidth,
  paddingOnTitle = true,
  showSearchInput = true,
  hasMinHg = true,
  iconsHasMaxW = false,
  cellPadding = "8px",
  border,
  borderRadius,
  paginationComponent,
  actionsButtons,
  actionsButtonsPosition = 'left',
}) => {
  const { isMobile } = useBreakpoint();
  const { t } = useTranslation();

  const [sort, setSort] = useState({
    column: "",
    direction: "asc",
    previousClicked: "",
  });

  const [selecteds, setSelecteds] = useState([
    {
      id: "checkall",
      checked: false,
    },
    ...data.map((user) => {
      return {
        id: user.id,
        checked: false,
      };
    }),
  ]);

  const resetSelecteds = () => {
    setSelecteds([
      {
        id: "checkall",
        checked: false,
      },
      ...data.map((user) => {
        return {
          id: user.id,
          checked: false,
        };
      }),
    ]);
  };

  useEffect(() => {
    resetSelecteds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const checkedItems = selecteds.filter((selected) =>
      selected.checked ? selected : undefined
    );
    if (checkedItems.length >= 1) {
      if (onCheckItems) onCheckItems(true);
      return;
    }

    if (onCheckItems) onCheckItems(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecteds]);

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.header)
  );

  const checkSortDirection = (columnName) => {
    if (columnName === sort.column && sort.direction === "desc") {
      return <CaretUp style={{ marginLeft: "10px" }} size={20} />;
    }
    return <CaretDown style={{ marginLeft: "10px" }} size={20} />;
  };

  const handleSort = (column, index) => {
    if (sort.previousClicked && sort.previousClicked !== column) {
      sort.direction = "asc";
    }
    const newDirection = sort.direction === "asc" ? "desc" : "asc";

    setSort({
      column,
      direction: newDirection,
      previousClicked: column,
    });

    data.sort((a, b) => {
      if (
        !a[column] ||
        !b[column] ||
        a[column] === null ||
        b[column] === null
      ) {
        return 0;
      }
      if (typeof a[column] === "boolean" && typeof b[column] === "boolean") {
        return (
          (a[column] === b[column] ? 0 : a[column] ? 1 : -1) *
          (newDirection === "asc" ? 1 : -1)
        );
      }
      if (typeof a[column] === "number" && typeof b[column] === "number") {
        return (a[column] - b[column]) * (newDirection === "asc" ? 1 : -1);
      }

      if (columns[index].sortFunc) {
        return columns[index].sortFunc(
          a,
          b,
          columns[index].access,
          newDirection
        );
      } else {
        return (
          a[column].localeCompare(b[column]) * (newDirection === "asc" ? 1 : -1)
        );
      }
    });

    resetSelecteds();
  };

  const handleCheckBoxes = (isChecked, user, checkAll = false) => {
    if (checkAll) {
      const updatedSelects = selecteds.map((selected) => {
        return (selected = {
          id: selected.id,
          checked: isChecked,
        });
      });
      setSelecteds(updatedSelects);
      return;
    }
    if (isChecked) {
      const updatedSelects = selecteds.map((selected) => {
        if (selected.id === user.id) {
          return (selected = {
            id: selected.id,
            checked: true,
          });
        }
        return selected;
      });
      setSelecteds(updatedSelects);
      return;
    }
    const updatedSelects = selecteds.map((selected) => {
      if (selected.id === user.id) {
        return (selected = {
          id: selected.id,
          checked: false,
        });
      }
      return selected;
    });
    setSelecteds(updatedSelects);
  };

  const renderTableHeader = () => {
    return columns.map((column, index) => {
      const isShowingThisColumn = visibleColumns.find(
        (visibleColumn) => column.header === visibleColumn
      );
      return (
        isShowingThisColumn && (
          <Th
            onClick={() => handleSort(column.access, index)}
            key={column.header + "thx"}
            cursor={"pointer"}
            border={"1px solid #ddd"}
          >
            <Text display={"flex"} alignItems={"center"}>
              {column.customHeader
                ? column.customHeader(column)
                : column.header}{" "}
              {checkSortDirection(column.access)}
            </Text>
          </Th>
        )
      );
    });
  };

  const renderTableRows = () => {
    return (
      data.length > 0 &&
      data.map((item, index) => {
        const isEvenNumber = index % 2 === 0 ? true : false;
        return (
          <Tr
            key={item.name + index}
            bgColor={isEvenNumber ? "#F5F5F5" : "white"}
            _hover={{ bgColor: "#ebebeb" }}
          >
            <Td border={"1px solid #ddd"} height={"15px"} w={"20px"}>
              <Checkbox
                size="lg"
                _checked={{
                  "& .chakra-checkbox__control": {
                    background: "primary.100",
                  },
                }}
                onChange={(e) => handleCheckBoxes(e.target.checked, item)}
                isChecked={selecteds[index + 1]?.checked ?? false}
              ></Checkbox>
            </Td>
            {columns.map((column, index) => {
              const isShowingThisColumn = visibleColumns.find(
                (visibleColumn) => column.header === visibleColumn
              );
              return (
                isShowingThisColumn && (
                  <Td
                    height={"15px"}
                    border={"1px solid #ddd"}
                    key={column + index}
                    padding={cellPadding}
                    fontSize={"sm"}
                  >
                    {column.customCell ? (
                      column.customCell(item)
                    ) : (
                      <Text>
                        {column.formatData
                          ? column.formatData(item[column.access], item)
                          : item[column.access]}
                      </Text>
                    )}
                  </Td>
                )
              );
            })}
            {icons && (
              <Td border={"0px solid #ddd"} w={iconsHasMaxW ? "20px" : null}>
                <Box display={"flex"}>
                  {icons &&
                    icons.map(
                      (icon, index) =>
                        icon &&
                        iconCondition(icon, item) && (
                          <Box
                            cursor={"pointer"}
                            key={index + "x"}
                            onClick={() => icon.onClickRow(item)}
                            title={icon.title ?? null}
                          >
                            {icon.icon}
                          </Box>
                        )
                    )}
                </Box>
              </Td>
            )}
          </Tr>
        );
      })
    );
  };

  const searchInput = () => {
    return (
<HStack
  spacing={4}
  align="center"
  p={2}
>
  <MagnifyingGlass 
    size={24} 
    weight="bold"
    color="var(--chakra-colors-gray-600)"
  />
  <FormInput
    variant="auth"
    fontSize="sm"
    ms={0}
    type="text"
    placeholder={t("Pesquisar")}
    fontWeight="500"
    size="lg"
    borderRadius="8px"
    bgColor="primary.50"
    width="240px"
    _hover={{ 
      bgColor: "gray.100",
      borderColor: "primary.200"
    }}
    _focus={{
      bgColor: "white",
      borderColor: "primary.300",
      boxShadow: "0 0 0 1px var(--chakra-colors-primary-300)"
    }}
    onChange={onChangeSearchInput}
    defaultValue={searchInputValue}
  />
</HStack>
    );
  };

  const shouldShowHeaderIcon = (icon) => {
    if (!icon.shouldShow) return false;
    return icon.isDisabled;
  };

  const iconCondition = (icon, item) => {
    if (icon && !icon.condition) return true;
    return icon.condition(item);
  };
  return (
    <Box
      w={isMobile ? "99%" : deskWidth ?? "100%"}
      margin={"0 auto"}
      bgColor={"#fafafa"} 
      minH={hasMinHg ? { lg: "500px", md: "500px" } : null}
      border={border}
      borderRadius="10px"  
      padding="5px"
      boxShadow="sm"
    >
      <VStack alignItems={"start"} padding={paddingOnTitle ? "20px" : "0px"}>
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          w={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
          padding={"20px"}
          gap={"10px"}
        >
          <Text
            fontSize={{ lg: "24px", md: "22px", sm: "20px" }}
            color={"navy.700"}
            fontWeight={"bold"}
            paddingBottom={isMobile ? "10px" : "0"}
            flex="1"  // Allow title to take available space
          >
            {title}
          </Text>
          
          {actionsButtons && (
            <Flex
              justifyContent={"center"}  // Always center
              alignItems={"center"}
              flex="1"  // Take equal space
            >
              {actionsButtons}
            </Flex>
          )}
          
          {showSearchInput && searchInput()}
        </Flex>
        
        {data.length > 0 && (
          <InteractiveButtons
            columns={columns}
            data={data}
            setVisibleColumns={setVisibleColumns}
            visibleColumns={visibleColumns}
            downloadTitle={title}
            formatOnDownLoad={formatOnDownLoad}
          />
        )}
      </VStack>
      <Box width={"100%"} overflow={"auto"}>
        <Table 
          overflow={"auto"}
          backgroundColor="white"
          padding="16px"
          borderCollapse="separate"
          borderSpacing="0"
          sx={{
            'td, th': {
              backgroundColor: 'white',
              padding: '7px 16px',
            },
          }}
        >
          <Thead>
            <Tr>
            <Th borderWidth="0.5px" borderColor="#000000">
                <Checkbox
                  marginRight={"10px"}
                  size="lg"
                  _checked={{
                    "& .chakra-checkbox__control": {
                      background: "primary.100",
                    },
                  }}
                  isChecked={selecteds[0].checked}
                  onChange={(e) => handleCheckBoxes(e.target.checked, {}, true)}
                />
              </Th>
              {renderTableHeader()}
              {icons && (
                <Th border={"1px solid #ddd"}>
                  <Box display={"flex"}>
                    {icons &&
                      icons.map(
                        (icon, index) =>
                          icon &&
                          icon.icon && (
                            <Box
                              key={index + "actionbuttons"}
                              onClick={() =>
                                shouldShowHeaderIcon(icon)
                                  ? icon.onClickHeader(
                                      selecteds.filter(
                                        (selected) => selected.checked
                                      )
                                    )
                                  : () => {}
                              }
                              cursor={
                                shouldShowHeaderIcon(icon)
                                  ? "pointer"
                                  : "not-allowed"
                              }
                              color={
                                shouldShowHeaderIcon(icon)
                                  ? "black"
                                  : "secondaryGray.500"
                              }
                            >
                              {icon.icon}
                            </Box>
                          )
                      )}
                  </Box>
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>{renderTableRows()}</Tbody>
        </Table>
      </Box>
      {paginationComponent && paginationComponent}
    </Box>
  );
};

export default TableCustom;
