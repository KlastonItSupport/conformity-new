import { api } from "api/api";
import { AuthContext } from "./auth";
import { toast } from "react-toastify";

const { createContext, useContext, useState } = require("react");

const IndicatorsContext = createContext();

const IndicatorsProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const [indicators, setIndicators] = useState([]);
  const [pagination, setPagination] = useState(null);

  const getIndicators = async (page = 1, search = "", limit = 10) => {
    const response = await api.get(
      `/indicators?page=${page}&search=${search}&pageSize=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    setIndicators(response.data.items);
    setPagination(response.data.pages);

    return response.data;
  };

  const addIndicator = async (data) => {
    const response = await api.post("indicators", data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 201) {
      toast.success("Indicador adicionado com sucesso");
      setIndicators([...indicators, response.data]);
    }
  };

  const deleteIndicator = async (id, showToast = true) => {
    const response = await api.delete(`indicators/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.data.status === 200) {
      if (showToast) {
        toast.success("Indicador excluído com sucesso");
      }
      setIndicators(indicators.filter((indicator) => indicator.id !== id));
    }
  };

  const deleteMultipleIndicators = async (selectedItems) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall" ? deleteIndicator(selected.id) : () => {}
    );
    await Promise.all(deletePromises);

    setIndicators(
      indicators.filter(
        (indicator) =>
          !selectedItems.some((selected) => selected.id === indicator.id)
      )
    );

    toast.success("Indicadores excluídos com sucesso!");
  };

  const editIndicator = async (data, id) => {
    const response = await api.patch(`indicators/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 200) {
      toast.success("Indicador editado com sucesso");
      setIndicators(
        indicators.map((indicator) => {
          if (indicator.id === id) {
            return { ...indicator, ...data };
          }
          return indicator;
        })
      );
    }
  };

  return (
    <IndicatorsContext.Provider
      value={{
        getIndicators,
        indicators,
        pagination,
        addIndicator,
        deleteIndicator,
        deleteMultipleIndicators,
        editIndicator,
      }}
    >
      {children}
    </IndicatorsContext.Provider>
  );
};

export { IndicatorsContext, IndicatorsProvider };
