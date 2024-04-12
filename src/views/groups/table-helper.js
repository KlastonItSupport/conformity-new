/* eslint-disable no-useless-computed-key */
const formatBoolean = (data) => (data ? "Sim" : "Não");

const formatReadDeleteEditColumns = (data) => {
  return `Criar: ${formatBoolean(data.canAdd)}| Consultar: ${formatBoolean(data.canRead)} | Deletar: ${formatBoolean(data.canDelete)}  | Editar: ${formatBoolean(data.canEdit)} `;
};

export const formatOnDownLoad = (data) => {
  const parsedDownload = [];

  data.map((element) => {
    parsedDownload.push({
      ["Nome"]: element.name,
      ["Documentos - Pode Criar "]: formatBoolean(element.documents.canAdd),
      ["Documentos - Pode Ler "]: formatBoolean(element.documents.canRead),
      ["Documentos - Pode Editar "]: formatBoolean(element.documents.canEdit),
      ["Documentos - Pode Apagar "]: formatBoolean(element.documents.canDelete),
      ["Tarefas - Pode Criar "]: formatBoolean(element.tasks.canAdd),
      ["Tarefas - Pode Ler "]: formatBoolean(element.tasks.canRead),
      ["Tarefas - Pode Editar "]: formatBoolean(element.tasks.canEdit),
      ["Tarefas - Pode Apagar "]: formatBoolean(element.tasks.canDelete),
      ["Equipamentos - Pode Criar "]: formatBoolean(element.equipments.canAdd),
      ["Equipamentos - Pode Ler "]: formatBoolean(element.equipments.canRead),
      ["Equipamentos - Pode Editar "]: formatBoolean(
        element.equipments.canEdit
      ),
      ["Equipamentos - Pode Apagar "]: formatBoolean(
        element.equipments.canDelete
      ),
      ["Indicadores - Pode Criar "]: formatBoolean(element.indicators.canAdd),
      ["Indicadores - Pode Ler "]: formatBoolean(element.indicators.canRead),
      ["Indicadores - Pode Editar "]: formatBoolean(element.indicators.canEdit),
      ["Indicadores - Pode Apagar "]: formatBoolean(
        element.indicators.canDelete
      ),
      ["CRM - Pode Criar "]: formatBoolean(element.crm.canAdd),
      ["CRM - Pode Ler "]: formatBoolean(element.crm.canRead),
      ["CRM - Pode Editar "]: formatBoolean(element.crm.canEdit),
      ["CRM - Pode Apagar "]: formatBoolean(element.crm.canDelete),
      ["Treinamentos - Pode Criar "]: formatBoolean(element.training.canAdd),
      ["Treinamentos - Pode Ler "]: formatBoolean(element.training.canRead),
      ["Treinamentos - Pode Editar "]: formatBoolean(element.training.canEdit),
      ["Treinamentos - Pode Apagar "]: formatBoolean(
        element.training.canDelete
      ),
      ["Empresas - Pode Criar "]: formatBoolean(element.companies.canAdd),
      ["Empresas - Pode Ler "]: formatBoolean(element.companies.canRead),
      ["Empresas - Pode Editar "]: formatBoolean(element.companies.canEdit),
      ["Empresas - Pode Apagar "]: formatBoolean(element.companies.canDelete),
    });
    return false;
  });
  return parsedDownload;
};

export const columns = [
  { header: "Nome", access: "name" },
  {
    header: "Documentos",
    access: "documents",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: "Tarefas",
    access: "tasks",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: "Equipamentos",
    access: "equipments",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: "Indicadores",
    access: "indicators",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: "CRM",
    access: "crm",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: "Treinamentos",
    access: "training",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: "Empresas",
    access: "companies",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
];

export const groupsMock = [
  {
    id: 1,
    name: "RH",
    documents: {
      cannAdd: false,
      canRead: false,
      canDelete: false,
      canEdit: false,
    },
    tasks: { cannAdd: false, canRead: true, canDelete: false, canEdit: true },
    equipments: {
      cannAdd: false,
      canRead: true,
      canDelete: false,
      canEdit: false,
    },
    indicators: {
      cannAdd: false,
      canRead: true,
      canDelete: true,
      canEdit: true,
    },
    crm: { cannAdd: false, canRead: true, canDelete: false, canEdit: false },
    training: { cannAdd: false, canRead: true, canDelete: true, canEdit: true },
    companies: {
      cannAdd: false,
      canRead: true,
      canDelete: false,
      canEdit: false,
    },
  },
  {
    id: 2,
    name: "Finance",
    documents: {
      canRead: true,
      canDelete: false,
      canEdit: false,
    },
    tasks: {
      canRead: true,
      canDelete: true,
      canEdit: true,
    },
    equipments: { canRead: false, canDelete: false, canEdit: true },
    indicators: { canRead: true, canDelete: true, canEdit: false },
    crm: { canRead: true, canDelete: false, canEdit: true },
    training: { canRead: false, canDelete: true, canEdit: false },
    companies: { canRead: true, canDelete: true, canEdit: true },
  },
  {
    id: 3,
    name: "Marketing",
    documents: {
      canRead: true,
      canDelete: true,
      canEdit: true,
    },
    tasks: {
      canRead: false,
      canDelete: false,
      canEdit: false,
    },
    equipments: { canRead: false, canDelete: false, canEdit: false },
    indicators: { canRead: true, canDelete: false, canEdit: true },
    crm: { canRead: true, canDelete: true, canEdit: false },
    training: { canRead: true, canDelete: false, canEdit: true },
    companies: { canRead: true, canDelete: true, canEdit: true },
  },
];
