import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Check } from "@phosphor-icons/react";
import * as XLSX from "xlsx/xlsx.mjs";
import Papa from "papaparse";
import { useBreakpoint } from "hooks/usebreakpoint";

export const InteractiveButtons = ({
  visibleColumns,
  columns,
  data,
  setVisibleColumns,
  downloadTitle,
  formatOnDownLoad,
}) => {
  const { isMobile } = useBreakpoint();

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
    <HStack spacing={"3"} p={2}>
      <Button
        variant="outline"
        colorScheme="blue"
        _hover={{ bg: "blue.50" }}
        onClick={handleExcel}
        borderRadius="sm"
        height="28px"
        px={2}
        fontSize="sm"
      >
        Excel
      </Button>
      <Button
        variant="outline"
        colorScheme="green"
        _hover={{ bg: "green.50" }}
        onClick={handleCSV}
        borderRadius="sm"
        height="28px"
        px={2}
        fontSize="sm"
      >
        CSV
      </Button>
      <Button
        variant="outline"
        colorScheme="purple"
        _hover={{ bg: "purple.50" }}
        borderRadius="sm"
        height="28px"
        px={2}
        fontSize="sm"
      >
        Print
      </Button>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          colorScheme="teal"
          _hover={{ bg: "teal.50" }}
          borderRadius="sm"
          height="28px"
          px={2}
          fontSize="sm"
          rightIcon={<ChevronDownIcon boxSize={4} />}
        >
          {isMobile ? "Column" : "Column Visibility"}
        </MenuButton>
        <MenuList boxShadow="xl" borderRadius="sm">
          {columns.map((column) => {
            const isShowingThisColumn = visibleColumns.find(
              (visibleColumn) => column.header === visibleColumn
            );
            const notAllowedToClick =
              visibleColumns.length === 1 ? true : false;
            return (
              <MenuItem
                _hover={{ bg: "gray.100" }}
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
                <Text fontSize="sm">{column.header} </Text>
                {isShowingThisColumn && <Check color="green" size={18} />}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </HStack>
  );
};
