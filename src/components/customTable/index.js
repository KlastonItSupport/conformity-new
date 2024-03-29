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
  useBreakpointValue,
} from "@chakra-ui/react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { InteractiveButtons } from "./components/interactive-buttons";
import FormInput from "components/form-input/form-input";

const TableCustom = ({ columns, data, title, onCheckItems, icons }) => {
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
      onCheckItems(true);
      return;
    }

    onCheckItems(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecteds]);

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.header)
  );

  const isMobile = useBreakpointValue({
    base: false,
    md: false,
    lg: false,
    sm: true,
  });
  const checkSortDirection = (columnName) => {
    if (columnName === sort.column && sort.direction === "desc") {
      return <CaretUp style={{ marginLeft: "10px" }} size={20} />;
    }
    return <CaretDown style={{ marginLeft: "10px" }} size={20} />;
  };

  const handleSort = (column) => {
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
      if (column === "company") {
        return (
          a.company.localeCompare(b.company) * (newDirection === "asc" ? 1 : -1)
        );
      } else if (column === "name") {
        return a.name.localeCompare(b.name) * (newDirection === "asc" ? 1 : -1);
      } else if (column === "email") {
        return (
          a.email.localeCompare(b.email) * (newDirection === "asc" ? 1 : -1)
        );
      } else if (column === "status") {
        return (
          a.status.localeCompare(b.status) * (newDirection === "asc" ? 1 : -1)
        );
      } else if (column === "accessRule") {
        return (
          a.accessRule.localeCompare(b.accessRule) *
          (newDirection === "asc" ? 1 : -1)
        );
      }
      return data;
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
    return columns.map((column) => {
      const isShowingThisColumn = visibleColumns.find(
        (visibleColumn) => column.header === visibleColumn
      );
      return (
        isShowingThisColumn && (
          <Th
            onClick={() => handleSort(column.access)}
            key={column.header + "thx"}
            cursor={"pointer"}
            border={"1px solid #ddd"}
          >
            <Text display={"flex"} alignItems={"center"}>
              {column.header} {checkSortDirection(column.access)}
            </Text>
          </Th>
        )
      );
    });
  };

  const renderTableRows = () => {
    return data.map((item, index) => {
      const isEvenNumber = index % 2 === 0 ? true : false;
      return (
        <Tr
          key={item.name + index}
          bgColor={isEvenNumber ? "#F5F5F5" : "white"}
          _hover={{ bgColor: "#ebebeb" }}
        >
          <Td border={"1px solid #ddd"} height={"15px"}>
            <Checkbox
              size="lg"
              _checked={{
                "& .chakra-checkbox__control": {
                  background: "primary.100",
                },
              }}
              onChange={(e) => handleCheckBoxes(e.target.checked, item)}
              isChecked={selecteds[index + 1].checked}
            ></Checkbox>
          </Td>
          {columns.map((column, index) => {
            //nn
            const isShowingThisColumn = visibleColumns.find(
              (visibleColumn) => column.header === visibleColumn
            );
            return (
              isShowingThisColumn && (
                <Td
                  height={"15px"}
                  border={"1px solid #ddd"}
                  key={column + index}
                >
                  {item[column.access]}
                </Td>
              )
            );
          })}
          <Td border={"1px solid #ddd"}>
            <Box display={"flex"}>
              {icons.map((icon, index) => (
                <Box
                  cursor={"pointer"}
                  key={index + "x"}
                  onClick={() => icon.onClickRow(item)}
                >
                  {icon.icon}
                </Box>
              ))}
            </Box>
          </Td>
        </Tr>
      );
    });
  };

  const searchInput = () => {
    return (
      <HStack>
        <Text>Search:</Text>
        <FormInput
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          placeholder="Pesquisar"
          margin="0 0 10px 0 "
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          width="200px"
        />
      </HStack>
    );
  };

  const shouldShowHeaderIcon = (icon) => {
    if (!icon.shouldShow) return false;
    return icon.isDisabled;
  };
  return (
    <Box w={isMobile ? "99vw" : "95vw"} margin={"0 auto"} bgColor={"white"}>
      <VStack alignItems={"start"} padding={"20px"}>
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          w={"100%"}
          justifyContent={"space-between"}
        >
          <Text
            fontSize={{ lg: "24px", md: "32px", sm: "24px" }}
            color={"navy.700"}
            fontWeight={"bold"}
            paddingBottom={isMobile ? "10px" : "0"}
          >
            {title}
          </Text>
          {searchInput()}
        </Flex>
        <InteractiveButtons
          columns={columns}
          data={data}
          setVisibleColumns={setVisibleColumns}
          visibleColumns={visibleColumns}
        />
      </VStack>
      <Box width={"95vw"} overflow={"auto"}>
        <Table overflow={"auto"}>
          <Thead>
            <Tr>
              <Th border={"1px solid #ddd"}>
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

              <Th border={"1px solid #ddd"}>
                <Box display={"flex"}>
                  {icons.map((icon, index) => (
                    <Box
                      key={index + "actionbuttons"}
                      onClick={() =>
                        shouldShowHeaderIcon(icon)
                          ? icon.onClickHeader(selecteds)
                          : () => {}
                      }
                      cursor={
                        shouldShowHeaderIcon(icon) ? "pointer" : "not-allowed"
                      }
                      color={
                        shouldShowHeaderIcon(icon)
                          ? "black"
                          : "secondaryGray.500"
                      }
                    >
                      {icon.icon}
                    </Box>
                  ))}
                </Box>
              </Th>
            </Tr>
          </Thead>
          <Tbody>{renderTableRows()}</Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TableCustom;
