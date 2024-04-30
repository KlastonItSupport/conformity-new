import * as yup from "yup";
import i18n from "../../i18n/index";

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required(i18n.t("* Email obrigatório"))
    .email(i18n.t("* Insira um email válido")),
  password: yup.string().required(i18n.t("* Senha obrigatória")),
  // language: yup
  //   .string()
  //   .required("* Idioma obrigatório")
  //   .oneOf(["portugues", "ingles", "espanhol"], "* Selecione um idioma válido"),
});
