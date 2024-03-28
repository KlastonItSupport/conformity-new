import * as Yup from "yup";

const editUsersFormSchema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  celphone: Yup.string()
    .matches(
      /^\([0-9]{2}\)\s[0-9]{4,5}-[0-9]{4}$/,
      "Formato de telefone inválido"
    )
    .required("O telefone é obrigatório"),
  role: Yup.string().required("O cargo é obrigatório"),
  email: Yup.string()
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),
  departament: Yup.string().required("O departamexnto é obrigatório"),
  accessRule: Yup.string().required("A regra é obrigatória"),
  status: Yup.string().required("O status é obrigatório"),
});

export default editUsersFormSchema;
