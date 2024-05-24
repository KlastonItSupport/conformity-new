import * as Yup from "yup";

export const addEvaluatorSchema = Yup.object().shape({
  evaluator: Yup.string().required("Avaliador  obrigatório"),
});
