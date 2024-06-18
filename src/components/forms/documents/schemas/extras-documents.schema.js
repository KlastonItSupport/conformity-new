import * as Yup from "yup";

export const extraDocumentsSchema = Yup.object().shape({
  documents: Yup.mixed(),
});
