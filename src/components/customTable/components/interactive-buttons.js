import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Check } from "@phosphor-icons/react";
import * as XLSX from "xlsx/xlsx.mjs";
import Papa from "papaparse";

export const InteractiveButtons = ({
  visibleColumns,
  columns,
  data,
  setVisibleColumns,
  downloadTitle,
  formatOnDownLoad,
}) => {
  const isMobile = useBreakpointValue({
    base: false,
    md: false,
    lg: false,
    sm: true,
  });

  const dataKeys = Object.keys(data[0]).filter(
    (key) => key !== "id" && key !== "passwordHash"
  );

  const dataWithoutSensitiveInfo = (item) => {
    const itemFormatted = {};
    columns.map(
      (column, index) => (itemFormatted[column.header] = item[dataKeys[index]])
    );

    return itemFormatted;
  };

  const handleExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      formatOnDownLoad
        ? formatOnDownLoad(data)
        : data.map((item) => dataWithoutSensitiveInfo(item))
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const workbookBlob = new Blob([XLSX.write(workbook, { type: "array" })], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(workbookBlob);
    downloadLink.download = `${downloadTitle}-excel`;
    downloadLink.click();
  };

  const handleCSV = async () => {
    const csvData = Papa.unparse(
      formatOnDownLoad
        ? formatOnDownLoad(data)
        : data.map((item) => dataWithoutSensitiveInfo(item))
    );
    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(
      new Blob([csvData], { type: "text/csv" })
    );
    downloadLink.download = `${downloadTitle}-csv.csv`;
    downloadLink.click();
  };

  const handleVisibilityColumns = (column) => {
    const isShowingThisColumn = visibleColumns.find(
      (visibleColumn) => column === visibleColumn
    );
    if (isShowingThisColumn) {
      if (visibleColumns.length === 1) return;

      setVisibleColumns(
        visibleColumns.filter((visibleColumn) => column !== visibleColumn)
      );
      return;
    }
    setVisibleColumns([...visibleColumns, column]);
  };
  return (
    <HStack spacing={"0"}>
      <Button
        _hover={{ bgColor: "secondaryGray.400" }}
        onClick={handleExcel}
        sx={{ borderRadius: "none" }}
        padding={isMobile ? 0 : null}
      >
        Excel
      </Button>
      <Button
        _hover={{ bgColor: "secondaryGray.400" }}
        onClick={handleCSV}
        sx={{ borderRadius: "none" }}
      >
        CSV
      </Button>
      <Button
        _hover={{ bgColor: "secondaryGray.400" }}
        sx={{ borderRadius: "none" }}
      >
        Print
      </Button>
      <Menu>
        <MenuButton
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bgColor: "secondaryGray.400" }}
          border={"none"}
          fontWeight={"semibold"}
        >
          {isMobile ? "Column" : "Column Visibility"} <ChevronDownIcon />
        </MenuButton>
        <MenuList>
          {columns.map((column) => {
            const isShowingThisColumn = visibleColumns.find(
              (visibleColumn) => column.header === visibleColumn
            );
            const notAllowedToClick =
              visibleColumns.length === 1 ? true : false;
            return (
              <MenuItem
                display={"flex"}
                justifyContent={"space-between"}
                onClick={() =>
                  !isShowingThisColumn
                    ? handleVisibilityColumns(column.header)
                    : notAllowedToClick
                      ? () => {}
                      : handleVisibilityColumns(column.header)
                }
                key={column.header}
                cursor={
                  !isShowingThisColumn
                    ? "pointer"
                    : notAllowedToClick
                      ? "not-allowed"
                      : "pointer"
                }
              >
                <Text>{column.header} </Text>
                {isShowingThisColumn && <Check color="green" size={20} />}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </HStack>
  );
};
