import * as Yup from "yup";
import i18n from "../../../i18n/index";
const editProfileSchema = Yup.object().shape({
  profilePic: Yup.mixed().test(
    "fileType",
    i18n.t("Somente arquivos PNG, JPG ou JPEG são permitidos"),
    (value) => {
      if (!value || !value[0]?.type) return true;
      return (
        value &&
        ["image/png", "image/jpg", "image/jpeg"].includes(value[0].type)
      );
    }
  ),
  name: Yup.string().required(i18n.t("Nome é obrigatório")),
  celphone: Yup.string().required(i18n.t("O telefone é obrigatório")),
  birthday: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    i18n.t("Formato inválido. Use o formato dd/mm/yyyy")
  ),
});

export default editProfileSchema;
