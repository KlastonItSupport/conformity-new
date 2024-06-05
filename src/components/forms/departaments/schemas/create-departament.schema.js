import * as Yup from "yup";

export const departamentSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});
