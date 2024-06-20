import * as Yup from "yup";

export const relatedDocsSchema = Yup.object().shape({
  documentSideId: Yup.string().required("Arquivo obrigatório"),
});
