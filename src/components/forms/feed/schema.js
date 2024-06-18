import * as Yup from "yup";

export const feedSchema = Yup.object().shape({
  text: Yup.string().required("Descrição  obrigatória"),
});
