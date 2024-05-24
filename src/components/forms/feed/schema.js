import * as Yup from "yup";

export const feedSchema = Yup.object().shape({
  description: Yup.string().required("Descrição  obrigatória"),
});
