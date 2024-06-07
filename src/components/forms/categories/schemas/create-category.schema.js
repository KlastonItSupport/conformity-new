import * as Yup from "yup";

export const categorySchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});
