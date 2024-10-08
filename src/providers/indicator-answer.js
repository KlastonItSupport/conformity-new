import { api } from "api/api";
import { AuthContext } from "./auth";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

const IndicatorsAnswerContext = createContext();

const IndicatorsAnswerProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);
  const [indicatorsAnswers, setIndicatorsAnswers] = useState([]);
  const [pagination, setPagination] = useState(null);

  const getIndicatorsAnswers = async (
    id,
    page = 1,
    search = "",
    limit = 10,
    queryParams
  ) => {
    const queryParamsString = queryParams
      ? `&initialDate=${queryParams.initialDate}&finalDate=${queryParams.finalDate}`
      : null;
    const response = await api.get(
      `/indicators/indicator-answer/${id}?page=${page}&search=${search}&pageSize=${limit}&${queryParamsString}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    setIndicatorsAnswers(response.data.items);
    setPagination(response.data.pages);

    return response.data;
  };

  const deleteIndicatorAnswer = async (id, showToast = true) => {
    const response = await api.delete(`/indicators/indicator-answer/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 200) {
      if (showToast) {
        toast.success("Resposta excluída com sucesso");
      }
      setIndicatorsAnswers(
        indicatorsAnswers.filter((indicator) => indicator.id !== id)
      );
    }
  };

  const deleteMultipleIndicatorsAnswers = async (selectedItems) => {
    const deletePromises = selectedItems.map((selected) =>
      selected.id !== "checkall"
        ? deleteIndicatorAnswer(selected.id, false)
        : () => {}
    );
    await Promise.all(deletePromises);

    setIndicatorsAnswers(
      indicatorsAnswers.filter(
        (indicator) =>
          !selectedItems.some((selected) => selected.id === indicator.id)
      )
    );

    toast.success("Respostas excluídas com sucesso!");
  };

  const addIndicatorAnswer = async (indicator) => {
    const response = await api.post("/indicators/indicator-answer", indicator, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 201) {
      toast.success("Resposta adicionada com sucesso!");
      setIndicatorsAnswers([...indicatorsAnswers, response.data]);
    }
  };

  const editIndicatorAnswer = async (indicator, id) => {
    const response = await api.patch(
      `/indicators/indicator-answer/${id}`,
      indicator,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (response.status === 200) {
      toast.success("Resposta editada com sucesso!");
      setIndicatorsAnswers(
        indicatorsAnswers.map((item) => {
          if (item.id === id) {
            return { ...indicator, indicator: item.indicator, id: item.id };
          }
          return item;
        })
      );
    }
  };

  const updateTasksColumn = (res) => {
    const copyIndicatorsAnswers = [...indicatorsAnswers];

    const indicatorsAnswersUpdatedIndex = copyIndicatorsAnswers.findIndex(
      (item) => item.id === res.indicator
    );

    if (indicatorsAnswersUpdatedIndex !== -1) {
      try {
        copyIndicatorsAnswers[indicatorsAnswersUpdatedIndex].tasks.push(res.id);
      } catch (e) {
        copyIndicatorsAnswers[indicatorsAnswersUpdatedIndex].tasks = [res.id];
      }

      setIndicatorsAnswers(copyIndicatorsAnswers);
    }
  };

  return (
    <IndicatorsAnswerContext.Provider
      value={{
        getIndicatorsAnswers,
        indicatorsAnswers,
        pagination,
        deleteIndicatorAnswer,
        deleteMultipleIndicatorsAnswers,
        addIndicatorAnswer,
        editIndicatorAnswer,
        updateTasksColumn,
      }}
    >
      {children}
    </IndicatorsAnswerContext.Provider>
  );
};

export { IndicatorsAnswerContext, IndicatorsAnswerProvider };
