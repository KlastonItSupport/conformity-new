import * as Yup from "yup";

export const addCompanySchema = Yup.object().shape({
  contact: Yup.string().required("Contato obrigatório"),
  email: Yup.string().required("Email obrigatório"),
  celphone: Yup.string().required("Telefone Obrigatório"),
  zipCode: Yup.string().required("CEP obrigatório"),
  state: Yup.string().required("Estado obrigatório"),
  city: Yup.string().required("Cidade obrigatória"),
  neighborhood: Yup.string().required("Bairro obrigatório"),
  address: Yup.string().required("Endereço obrigatório"),
  number: Yup.string()
    .matches(/^\d+$/, "Somente números são permitidos")
    .required("Número obrigatório"),
  complement: Yup.string().required("Complemento obrigatório"),
  usersLimit: Yup.string().required("Limite de usuários obrigatório"),
  memoryLimit: Yup.string().required("Memoria limite obrigatória"),
  name: Yup.string().required("Nome  obrigatória"),
  status: Yup.string().required("Status obrigatório"),
});
