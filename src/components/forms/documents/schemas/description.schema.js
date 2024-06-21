import * as Yup from "yup";

export const documentDescriptionSchema = Yup.object().shape({
  description: Yup.string(),
});
