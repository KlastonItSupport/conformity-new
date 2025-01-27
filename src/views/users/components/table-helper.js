import i18n from "../../../i18n/index";

const formatAccessRule = (value) => {
  switch (value) {
    case 'super-admin':
      return 'root';
    default:
      return value;
  }
};

export const columns = [
  { header: i18n.t("Empresa"), access: "companyName" },
  { header: i18n.t("Nome"), access: "name" },
  { header: "Email", access: "email" },
  { header: i18n.t("Status"), access: "status" },
  { 
    header: i18n.t("Regra"), 
    access: "accessRule",
    formatData: formatAccessRule
  },
];