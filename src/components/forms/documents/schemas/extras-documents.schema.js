import * as Yup from "yup";

export const extraDocumentsSchema = Yup.object().shape({
  profilePic: Yup.mixed().test(
    "fileType",
    "Somente arquivos PNG, JPG ou JPEG são permitidos",
    (value) => {
      if (!value || !value[0]?.type) return true;
      return (
        value &&
        ["image/png", "image/jpg", "image/jpeg"].includes(value[0].type)
      );
    }
  ),
});
