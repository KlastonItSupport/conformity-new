import * as Yup from "yup";

export const relatedDocsSchema = Yup.object().shape({
  file: Yup.string().required("Arquivo obrigatório"),
});
