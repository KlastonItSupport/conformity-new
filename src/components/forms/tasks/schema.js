import * as Yup from "yup";

const tasksSchema = Yup.object().shape({
  title: Yup.string().required("O título é obrigatório"),
  status: Yup.string().required("O status é obrigatório"),
  project: Yup.string().required("O projeto é obrigatório"),
  prevision: Yup.string().required("O previsão é obrigatório"),
  type: Yup.string().required("O tipo é obrigatório"),
  origin: Yup.string().required("O origem é obrigatório"),
  classification: Yup.string().required("A classificação é obrigatória"),
  evaluator: Yup.string().required("O avaliador é obrigatório"),
});

export const editPasswordSchema = Yup.object().shape({
  password: Yup.string().required("O status é obrigatório"),
});

export default tasksSchema;
