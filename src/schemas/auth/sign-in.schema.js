import * as yup from "yup";

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required("* Email obrigatório")
    .email("* Insira um email válido"),
  password: yup.string().required("* Senha obrigatória"),
  // language: yup
  //   .string()
  //   .required("* Idioma obrigatório")
  //   .oneOf(["portugues", "ingles", "espanhol"], "* Selecione um idioma válido"),
});
