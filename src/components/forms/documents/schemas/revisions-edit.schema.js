import * as Yup from "yup";

export const revisionEditSchema = Yup.object().shape({
  description: Yup.string().required("Descrição  obrigatória"),
  date: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
});
