import * as Yup from "yup";

const addCompanySchema = Yup.object().shape({
  company: Yup.string().required("Nome da empresa obrigatório"),
  contact: Yup.string().required("Contato obrigatório"),
  email: Yup.string().required("Email obrigatório"),
  celphone: Yup.string().required("Telefone Obrigatório"),
  zipcode: Yup.string().required("CEP obrigatório"),
  state: Yup.string().required("Estado obrigatório"),
  city: Yup.string().required("Cidade obrigatória"),
  neighborhood: Yup.string().required("Bairro obrigatório"),
  address: Yup.string().required("Endereço obrigatório"),
  number: Yup.string().required("Número obrigatório"),
  complement: Yup.string().required("Complemento obrigatório"),
  usersLimit: Yup.string().required("Limite de usuários obrigatório"),
  memoryLimite: Yup.string().required("Memoria limite obrigatória"),
  status: Yup.string().required("Status obrigatório"),
});

export default addCompanySchema;
