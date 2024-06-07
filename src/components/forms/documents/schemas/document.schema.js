import * as Yup from "yup";

export const documentSchema = Yup.object().shape({
  name: Yup.string().required("Nome  obrigatório"),
  project: Yup.string().required("Projeto obrigatório"),
  owner: Yup.string().required("Autor obrigatório"),
  departamentId: Yup.string().required("Departamento obrigatório"),
  categoryId: Yup.string().required("Categoria obrigatória"),
  inclusionDate: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  revisionDate: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  createDate: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  validity: Yup.string().required("Validade obrigatória"),
  revision: Yup.number("Somente números aceitos").required(
    "Revisão obrigatória"
  ),
  minimumRetention: Yup.number().required("Retenção Mínima (anos) obrigatória"),
  identification: Yup.string().required("Identificação obrigatória"),
  protection: Yup.string().required("Proteção obrigatória"),
  recovery: Yup.string().required("Recuperação obrigatória"),
  disposition: Yup.string().required("Disposição obrigatória"),
  local: Yup.string().required("Localização obrigatória"),
  type: Yup.string().required("Tipo obrigatório"),
});
