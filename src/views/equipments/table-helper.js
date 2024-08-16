import moment from "moment";

// name, model, series, manufacturer, certified, range, tolerancy, nextAction
export const columns = [
  {
    header: "Nome",
    access: "name",
  },
  {
    header: "Modelo",
    access: "model",
  },
  {
    header: "Série",
    access: "series",
  },
  {
    header: "Fabricante",
    access: "manufacturer",
  },
  {
    header: "Certificado",
    access: "certified",
  },
  {
    header: "Alcance",
    access: "range",
  },
  {
    header: "Tolerância",
    access: "tolerancy",
  },
  {
    header: "Próxima ação",
    access: "nextAction",
    formatData: (data) => {
      if (data) {
        return moment.utc(data).format("DD/MM/YYYY");
      }
      return "N/A";
    },
  },
];
