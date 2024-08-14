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
  },
];

export const mockedData = [
  {
    id: 1,
    name: "Equipamento 1",
    model: "Modelo 1",
    series: "Série 1",
    manufacturer: "Fabricante 1",
    certified: "S2ESAGH2",
    range: "Alcance 1",
    tolerancy: "Tolerância 1",
    nextAction: "14/05/2022",
  },
  {
    id: 2,
    name: "Equipamento 2",
    model: "Modelo 2",
    series: "Série 2",
    manufacturer: "Fabricante 2",
    certified: "SDCASAW2",
    range: "Alcance 2",
    tolerancy: "Tolerância 2",
    nextAction: "28/05/2024",
  },
  {
    id: 3,
    name: "Equipamento 3",
    model: "Modelo 3",
    series: "Série 3",
    manufacturer: "Fabricante 3",
    certified: "NNS2SAW2",
    range: "Alcance 3",
    tolerancy: "Tolerância 3",
    nextAction: "28/05/2022",
  },
];
