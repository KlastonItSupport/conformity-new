import i18n from "../../i18n/index.js";

export const columns = [
  { header: i18n.t("Nome"), access: "name" },
  { header: i18n.t("Contato"), access: "contact" },
  {
    header: i18n.t("Limite de Usuários"),
    access: "usersLimit",
    sortFunc: (a, b, key, newDirection) => {
      return (b[key] - a[key]) * (newDirection === "asc" ? 1 : -1);
    },
  },
  { header: i18n.t("Limite de Espaço(MB)"), access: "memoryLimit" },
  { header: i18n.t("Status"), access: "status" },
];
