import * as Yup from "yup";

const editUsersFormSchema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  celphone: Yup.string().required("O telefone é obrigatório"),
  companyId: Yup.string().required("A empresa é obrigatória"),
  role: Yup.string().required("O cargo é obrigatório"),
  email: Yup.string()
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),
  departament: Yup.string().required("O departamexnto é obrigatório"),
  accessRule: Yup.string().required("A regra é obrigatória"),
  status: Yup.string().required("O status é obrigatório"),
});

export const editPasswordSchema = Yup.object().shape({
  password: Yup.string().required("O status é obrigatório"),
});

export default editUsersFormSchema;
