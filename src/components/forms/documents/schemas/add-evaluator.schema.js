import * as Yup from "yup";

export const addEvaluatorSchema = Yup.object().shape({
  userId: Yup.string().required("Avaliador  obrigatório"),
});
