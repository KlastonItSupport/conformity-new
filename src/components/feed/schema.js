import * as Yup from "yup";

export const FeedSchema = Yup.object().shape({
  text: Yup.mixed().required("Obrigatório"),
});
