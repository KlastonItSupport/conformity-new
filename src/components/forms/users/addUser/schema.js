import * as Yup from "yup";

const addUserSchema = Yup.object().shape({
  company: Yup.string().required("O empresa é obrigatória"),
  status: Yup.string().required("Status é obrigatório"),
  email: Yup.string()
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .required("Senha Obrigatória")
    .min("Minimo de 10 digitos", 10),
  celphone: Yup.string()
    .matches(
      /^\([0-9]{2}\)\s[0-9]{4,5}-[0-9]{4}$/,
      "Formato de telefone inválido"
    )
    .required("O telefone é obrigatório"),
  role: Yup.string().required("O cargo é obrigatório"),
  departament: Yup.string().required("O departamexnto é obrigatório"),
  accessRule: Yup.string().required("A regra é obrigatória"),
});

export default addUserSchema;
