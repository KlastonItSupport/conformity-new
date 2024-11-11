import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { Link, Text } from "@chakra-ui/react";
import moment from "moment";
const MatrizContext = createContext();

const MatrizProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);

  const handlingFilterParams = (filterParams) => {
    const filters = filterParams;

    const filtersParam = Object.keys(filters)
      .filter((key) => filters[key] !== undefined && filters[key] !== null)
      .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
      .join("&");

    return filtersParam ? `${filtersParam}` : "";
  };

  const getMatriz = async (
    page = 1,
    search = "",
    limit = 10,
    queryParams = {}
  ) => {
    const queryParamsString = handlingFilterParams(queryParams);
    const response = await api.get(
      `/matriz?page=${page}&search=${search}&pageSize=${limit}&${queryParamsString}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response.data;
  };

  const handleTableColumns = (columns, setColumns) => {
    console.log("columns", columns);
    try {
      const tableColumns = [
        {
          header: "Funcionários",
          access: "username",
          customCell: (item) => {
            return <Text fontWeight={"bold"}>{item.username}</Text>;
          },
        },
        ...columns.map((column) => ({
          header: column,
          access: column,
          formatData: (data, item) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dateParam = new Date(data);
            dateParam.setHours(0, 0, 0, 0);

            return (
              <Link
                onClick={() =>
                  window.open(
                    `/trainings/certificates/${item[`${column}-id`]}`,
                    "_blank"
                  )
                }
                color={dateParam < today ? "red.500" : "primary.100"}
                cursor={"pointer"}
                _hover={{ textDecoration: "underline" }}
              >
                {data ? moment(data).format("DD/MM/YYYY") : "N/A"}
              </Link>
            );
          },
        })),
      ];
      return tableColumns;
    } catch (e) {
      console.log("erro", e);
    }
  };
  return (
    <MatrizContext.Provider
      value={{
        getMatriz,
        handleTableColumns,
      }}
    >
      {children}
    </MatrizContext.Provider>
  );
};

export { MatrizContext, MatrizProvider };
