import * as Yup from "yup";

const addUserSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string()
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .required("Senha Obrigatória")
    .min(10, "Minimo de 10 digitos"),
  celphone: Yup.string().required("O telefone é obrigatório"),
  companyId: Yup.string()
    .required("A empresa é obrigatória")
    .notOneOf(["1"], "Invalid company selection"),
  role: Yup.string().required("O cargo é obrigatório"),
  departament: Yup.string().required("O departamexnto é obrigatório"),
  status: Yup.string().required("Status é obrigatório"),
  accessRule: Yup.string().required("A regra é obrigatória"),
  groupId: Yup.string(),
});

export default addUserSchema;
