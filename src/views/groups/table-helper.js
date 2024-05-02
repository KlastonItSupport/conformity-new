import i18n from "../../i18n/index.js";

/* eslint-disable no-useless-computed-key */
const formatBoolean = (data) => (data ? "Sim" : "Não");

const formatReadDeleteEditColumns = (data) => {
  return `${i18n.t("Criar")}: ${formatBoolean(data.canAdd)} | ${i18n.t("Consultar")}: ${formatBoolean(data.canRead)} | ${i18n.t("Deletar")}: ${formatBoolean(data.canDelete)}  | ${i18n.t("Editar")}: ${formatBoolean(data.canEdit)} `;
};

export const formatOnDownLoad = (data) => {
  const parsedDownload = [];

  data.map((element) => {
    parsedDownload.push({
      [i18n.t("Nome")]: element.name,
      [`${i18n.t("Documentos")} - ${i18n.t("Pode Criar")} `]: formatBoolean(
        element.documents.canAdd
      ),
      [`${i18n.t("Documentos")} - ${i18n.t("Pode Ler")} `]: formatBoolean(
        element.documents.canRead
      ),
      [`${i18n.t("Documentos")} - ${i18n.t("Pode Editar")} `]: formatBoolean(
        element.documents.canEdit
      ),
      [`${i18n.t("Documentos")} - ${i18n.t("Pode Apagar")} `]: formatBoolean(
        element.documents.canDelete
      ),
      [`${i18n.t("Tarefas")} - ${i18n.t("Pode Criar")} `]: formatBoolean(
        element.tasks.canAdd
      ),
      [`${i18n.t("Tarefas")} - ${i18n.t("Pode Ler")} `]: formatBoolean(
        element.tasks.canRead
      ),
      [`${i18n.t("Tarefas")} - ${i18n.t("Pode Editar")} `]: formatBoolean(
        element.tasks.canEdit
      ),
      [`${i18n.t("Tarefas")} - ${i18n.t("Pode Apagar")} `]: formatBoolean(
        element.tasks.canDelete
      ),
      [`${i18n.t("Equipamentos")} - ${i18n.t("Pode Criar")} `]: formatBoolean(
        element.equipments.canAdd
      ),
      [`${i18n.t("Equipamentos")} - ${i18n.t("Pode Ler")} `]: formatBoolean(
        element.equipments.canRead
      ),
      [`${i18n.t("Equipamentos")} - ${i18n.t("Pode Editar")} `]: formatBoolean(
        element.equipments.canEdit
      ),
      [`${i18n.t("Equipamentos")} - ${i18n.t("Pode Apagar")} `]: formatBoolean(
        element.equipments.canDelete
      ),
      [`${i18n.t("Indicadores")} - ${i18n.t("Pode Criar")} `]: formatBoolean(
        element.indicators.canAdd
      ),
      [`${i18n.t("Indicadores")} - ${i18n.t("Pode Ler")} `]: formatBoolean(
        element.indicators.canRead
      ),
      [`${i18n.t("Indicadores")} - ${i18n.t("Pode Editar")} `]: formatBoolean(
        element.indicators.canEdit
      ),
      [`${i18n.t("Indicadores")} - ${i18n.t("Pode Apagar")} `]: formatBoolean(
        element.indicators.canDelete
      ),
      [`${i18n.t("CRM")} - ${i18n.t("Pode Ler")} `]: formatBoolean(
        element.crm.canRead
      ),
      [`${i18n.t("CRM")} - ${i18n.t("Pode Editar")} `]: formatBoolean(
        element.crm.canEdit
      ),
      [`${i18n.t("CRM")} - ${i18n.t("Pode Apagar")} `]: formatBoolean(
        element.crm.canDelete
      ),
      [`${i18n.t("Treinamentos")} - ${i18n.t("Pode Criar")} `]: formatBoolean(
        element.training.canAdd
      ),
      [`${i18n.t("Treinamentos")} - ${i18n.t("Pode Ler")} `]: formatBoolean(
        element.training.canRead
      ),
      [`${i18n.t("Treinamentos")} - ${i18n.t("Pode Editar")} `]: formatBoolean(
        element.training.canEdit
      ),
      [`${i18n.t("Treinamentos")} - ${i18n.t("Pode Apagar")} `]: formatBoolean(
        element.training.canDelete
      ),
      [`${i18n.t("Empresas")} - ${i18n.t("Pode Criar")} `]: formatBoolean(
        element.companies.canAdd
      ),
      [`${i18n.t("Empresas")} - ${i18n.t("Pode Ler")} `]: formatBoolean(
        element.companies.canRead
      ),
      [`${i18n.t("Empresas")} - ${i18n.t("Pode Editar")} `]: formatBoolean(
        element.companies.canEdit
      ),
      [`${i18n.t("Empresas")} - ${i18n.t("Pode Apagar")} `]: formatBoolean(
        element.companies.canDelete
      ),
    });
    return false;
  });
  return parsedDownload;
};

export const columns = [
  { header: i18n.t("Nome"), access: "name" },
  {
    header: i18n.t("Documentos"),
    access: "documents",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: i18n.t("Tarefas"),
    access: "tasks",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: i18n.t("Equipamentos"),
    access: "equipments",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: i18n.t("Indicadores"),
    access: "indicators",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: i18n.t("CRM"),
    access: "crm",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: i18n.t("Treinamentos"),
    access: "training",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
  {
    header: i18n.t("Empresas"),
    access: "companies",
    formatData: formatReadDeleteEditColumns,
    sortFunc: () => {},
  },
];
