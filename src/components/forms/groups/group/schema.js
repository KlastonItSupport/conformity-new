import * as Yup from "yup";

export const groupSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
});
