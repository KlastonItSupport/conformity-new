import * as Yup from "yup";
import i18n from "../../../i18n/index";

const reminderSchema = Yup.object().shape({
  status: Yup.string().oneOf(["ATIVO", "INATIVO"], i18n.t("Status inválido")),
  frequency: Yup.string().oneOf(
    ["DIÁRIA", "SEMANAL", "MENSAL", "ANUAL", "UMA VEZ"],
    i18n.t("Frequência inválida")
  ),

  weekDay: Yup.string().when("frequency", {
    is: "SEMANAL" || "MENSAL" || "ANUAL",
    then: Yup.string().oneOf(
      ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"],
      i18n.t("Dia da semana inválido")
    ),
    otherwise: () => Yup.string().nullable(),
  }),
  dataEnd: Yup.string().matches(
    /^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/,
    "Formato inválido. Use o formato dd/mm/yyyy"
  ),
  hour: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, i18n.t("Hora inválida"))
    .nullable(),
  text: Yup.string().nullable(),
  key: Yup.string().uuid(i18n.t("UUID inválido")).nullable(),
  module: Yup.string().nullable(),
  days: Yup.array().when("frequency", {
    is: "DIÁRIA",
    then: () =>
      Yup.array()
        .of(
          Yup.object().shape({
            label: Yup.string().required(),
            value: Yup.string().required(),
            isChecked: Yup.boolean().required(),
          })
        )
        .test(
          "at-least-one-checked",
          "Pelo menos um dia deve ser selecionado.",
          (days) => Array.isArray(days) && days.some((day) => day.isChecked)
        ),
    otherwise: () => Yup.array().nullable(),
  }),
});

export default reminderSchema;
