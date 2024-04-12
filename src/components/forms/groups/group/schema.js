import * as Yup from "yup";

export const groupSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
  users: Yup.array().required("Precisa selecionar ao menos 1 usuário"),
});
