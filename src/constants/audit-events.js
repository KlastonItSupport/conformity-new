const USER_EVENTS = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED",
  USER_SIGNED_IN: "USER_SIGNED_IN",
  USER_SIGNED_OUT: "USER_SIGNED_OUT",
};

const DOCUMENTS_EVENTS = {
  DOCUMENTS_GET: "DOCUMENTS_GET",
  DOCUMENT_DELETED: "DOCUMENT_DELETED",
  DOCUMENT_CREATED: "DOCUMENT_CREATED",
  DOCUMENT_UPDATED: "DOCUMENT_UPDATED",
  //Detalhes do documento
  DOCUMENTS_DETAILS_GET: "DOCUMENTS_DETAILS_GET",
  DOCUMENT_DETAILS_FEED_CREATED: "DOCUMENT_DETAILS_FEED_CREATED",
  DOCUMENT_DETAILS_FEED_DELETED: "DOCUMENT_DETAILS_FEED_DELETED",
  DOCUMENT_DETAILS_FEED_UPDATED: "DOCUMENT_DETAILS_FEED_UPDATED",
  DOCUMENTS_DETAILS_ADD_ADDITIONAL_DOCUMENT:
    "DOCUMENTS_DETAILS_ADD_ADDITIONAL_DOCUMENT",
  DOCUMENTS_DETAILS_DELETE_ADDITIONAL_DOCUMENT:
    "DOCUMENTS_DETAILS_DELETE_ADDITIONAL_DOCUMENT",

  //Revisoes
  DOCUMENTS_DETAILS_ADD_REVISION: "DOCUMENTS_DETAILS_ADD_REVISION",
  DOCUMENTS_DETAILS_EDIT_REVISION: "DOCUMENTS_DETAILS_EDIT_REVISION",
  DOCUMENTS_DETAILS_DELETE_REVISION: "DOCUMENTS_DETAILS_DELETE_REVISION",

  //Avaliaçoes
  DOCUMENTS_DETAILS_ADD_EVALUATOR: "DOCUMENTS_DETAILS_ADD_EVALUATOR",
  DOCUMENTS_DETAILS_DELETE_EVALUATOR: "DOCUMENTS_DETAILS_DELETE_EVALUATOR",

  // Relacionados
  DOCUMENTS_DETAILS_ADD_RELATED: "DOCUMENTS_DETAILS_ADD_RELATED",
  DOCUMENTS_DETAILS_DELETE_RELATED: "DOCUMENTS_DETAILS_DELETE_RELATED",

  // Permissoes
  DOCUMENTS_DETAILS_ADD_DEPARTAMENT_PERMISSION:
    "DOCUMENTS_DETAILS_ADD_DEPARTAMENT_PERMISSION",
  DOCUMENTS_DETAILS_DELETE_DEPARTAMENT_PERMISSION:
    "DOCUMENTS_DETAILS_DELETE_DEPARTAMENT_PERMISSION",

  // Categorias
  DOCUMENTS_ADD_CATEGORY: "DOCUMENTS_ADD_CATEGORY",
  DOCUMENTS_DELETE_CATEGORY: "DOCUMENTS_DELETE_CATEGORY",
  DOCUMENTS_UPDATE_CATEGORY: "DOCUMENTS_UPDATE_CATEGORY",
  DOCUMENTS_LIST_CATEGORIES: "DOCUMENTS_LIST_CATEGORIES",

  // Análise
  DOCUMENTS_ANALYSIS_LIST: "DOCUMENTS_ANALYSIS_LIST",
};

export const TASKS_EVENTS = {
  TASKS_LIST: "TASKS_LIST",
  TASKS_ADD: "TASKS_ADD",
  TASKS_DELETED: "TASKS_DELETED",
  TASKS_UPDATED: "TASKS_UPDATED",

  // Detalhes da tarefa
  TASKS_DETAILS_GET: "TASKS_DETAILS_GET",
  TASKS_DETAILS_CHANGE_STATUS: "TASKS_DETAILS_CHANGE_STATUS",
  TASKS_DETAILS_CHANGE_PREVISION: "TASKS_DETAILS_CHANGE_PREVISION",
  TASKS_DETAILS_ADD_EVALUATOR: "TASKS_DETAILS_ADD_EVALUATOR",
  TASKS_DETAILS_DELETE_EVALUATOR: "TASKS_DETAILS_DELETE_EVALUATOR",
  TASKS_DETAILS_ADD_ATTACHMENT: "TASKS_DETAILS_ADD_ATTACHMENT",
  TASKS_DETAILS_DELETE_ATTACHMENT: "TASKS_DETAILS_DELETE_ATTACHMENT",

  // Feed
  TASKS_DETAILS_FEED_CREATED: "TASKS_DETAILS_FEED_CREATED",
  TASKS_DETAILS_FEED_DELETED: "TASKS_DETAILS_FEED_DELETED",
  TASKS_DETAILS_FEED_UPDATED: "TASKS_DETAILS_FEED_UPDATED",

  // 5 Whys
  TASKS_DETAILS_5WHY_CREATED: "TASKS_DETAILS_5WHY_CREATED",
  TASKS_DETAILS_5WHY_DELETED: "TASKS_DETAILS_5WHY_DELETED",
  TASKS_DETAILS_5WHY_UPDATED: "TASKS_DETAILS_5WHY_UPDATED",

  // Causa Raiz
  TASKS_DETAILS_ROOT_CAUSE_CREATED: "TASKS_DETAILS_ROOT_CAUSE_CREATED",
  TASKS_DETAILS_ROOT_CAUSE_DELETED: "TASKS_DETAILS_ROOT_CAUSE_DELETED",
  TASKS_DETAILS_ROOT_CAUSE_UPDATED: "TASKS_DETAILS_ROOT_CAUSE_UPDATED",

  // Açoes Imediatas
  TASKS_DETAILS_IMMEDIATE_ACTIONS_CREATED:
    "TASKS_DETAILS_IMMEDIATE_ACTIONS_CREATED",
  TASKS_DETAILS_IMMEDIATE_ACTIONS_DELETED:
    "TASKS_DETAILS_IMMEDIATE_ACTIONS_DELETED",
  TASKS_DETAILS_IMMEDIATE_ACTIONS_UPDATED:
    "TASKS_DETAILS_IMMEDIATE_ACTIONS_UPDATED",

  // Açoes Corretivas
  TASKS_DETAILS_CORRECTIVE_ACTIONS_CREATED:
    "TASKS_DETAILS_CORRECTIVE_ACTIONS_CREATED",
  TASKS_DETAILS_CORRECTIVE_ACTIONS_DELETED:
    "TASKS_DETAILS_CORRECTIVE_ACTIONS_DELETED",
  TASKS_DETAILS_CORRECTIVE_ACTIONS_UPDATED:
    "TASKS_DETAILS_CORRECTIVE_ACTIONS_UPDATED",

  // Reminders
  TASKS_DETAILS_REMINDER_CREATED: "TASKS_DETAILS_REMINDER_CREATED",
  TASKS_DETAILS_REMINDER_UPDATED: "TASKS_DETAILS_REMINDER_UPDATED",
  TASKS_DETAILS_REMINDER_DELETED: "TASKS_DETAILS_REMINDER_DELETED",

  // Origens
  TASKS_ORIGENS_LIST: "TASKS_ORIGENS_LIST",
  TASKS_ORIGENS_CREATED: "TASKS_ORIGENS_CREATED",
  TASKS_ORIGENS_DELETED: "TASKS_ORIGENS_DELETED",
  TASKS_ORIGENS_UPDATED: "TASKS_ORIGENS_UPDATED",

  // Tipos
  TASKS_TYPES_LIST: "TASKS_TYPES_LIST",
  TASKS_TYPES_CREATED: "TASKS_TYPES_CREATED",
  TASKS_TYPES_DELETED: "TASKS_TYPES_DELETED",
  TASKS_TYPES_UPDATED: "TASKS_TYPES_UPDATED",

  TASKS_CLASSIFICATIONS_LIST: "TASKS_CLASSIFICATIONS_LIST",
  TASKS_CLASSIFICATIONS_CREATED: "TASKS_CLASSIFICATIONS_CREATED",
  TASKS_CLASSIFICATIONS_DELETED: "TASKS_CLASSIFICATIONS_DELETED",
  TASKS_CLASSIFICATIONS_UPDATED: "TASKS_CLASSIFICATIONS_UPDATED",
};

const EQUIPMENT_EVENTS = {
  EQUIPMENTS_LIST: "EQUIPMENTS_LIST",
  EQUIPMENTS_CREATED: "EQUIPMENTS_CREATED",
  EQUIPMENTS_DELETED: "EQUIPMENTS_DELETED",
  EQUIPMENTS_UPDATED: "EQUIPMENTS_UPDATED",
  EQUIPMENTS_GET_ACTIONS: "EQUIPMENTS_GET_ACTIONS",
  EQUIPMENTS_CREATE_ACTIONS: "EQUIPMENTS_CREATE_ACTIONS",
  EQUIPMENTS_DELETE_ACTIONS: "EQUIPMENTS_DELETE_ACTIONS",
  EQUIPMENTS_UPDATE_ACTIONS: "EQUIPMENTS_UPDATE_ACTIONS",
  EQUIPMENTS_DOCUMENTS_ADD: "EQUIPMENTS_DOCUMENTS_ADD",
  EQUIPMENTS_DOCUMENTS_DELETED: "EQUIPMENTS_DOCUMENTS_DELETED",
};

const INDICATORS_EVENTS = {
  INDICATORS_CREATED: "INDICATORS_CREATED",
  INDICATORS_DELETED: "INDICATORS_DELETED",
  INDICATORS_UPDATED: "INDICATORS_UPDATED",
  INDICATORS_LIST: "INDICATORS_LIST",

  // Gráficos
  INDICATORS_GRAPHS: "INDICATORS_GRAPHS",
  INDICATORS_GRAPHS_CREATE: "INDICATORS_GRAPHS_CREATE",
  INDICATORS_GRAPHS_DELETE: "INDICATORS_GRAPHS_DELETE",
  INDICATORS_GRAPHS_UPDATE: "INDICATORS_GRAPHS_UPDATE",
};

const CRM_SERVICES_EVENTS = {
  CRM_SUPPLIERS_CREATED: "CRM_SUPPLIERS_CREATED",
  CRM_SUPPLIERS_UPDATED: "CRM_SUPPLIERS_UPDATED",
  CRM_SUPPLIERS_DELETED: "CRM_SUPPLIERS_DELETED",
  CRM_SUPPLIERS_LIST: "CRM_SUPPLIERS_LIST",

  // Leads
  CRM_LEADS_LIST: "CRM_LEADS_LIST",
  CRM_LEADS_CREATE: "CRM_LEADS_CREATE",
  CRM_LEADS_EDIT: "CRM_LEADS_EDIT",
  CRM_LEADS_DELETE: "CRM_LEADS_DELETE",

  // Tarefas do lead
  TASKS_LEADS_LIST: "TASKS_LEADS_LIST",
  TASKS_LEADS_CREATE: "TASKS_LEADS_CREATE",
  TASKS_LEADS_EDIT: "TASKS_LEADS_EDIT",
  TASKS_LEADS_DELETE: "TASKS_LEADS_DELETE",

  // Projects
  CRM_PROJECTS_LIST: "CRM_PROJECTS_LIST",
  CRM_PROJECTS_CREATE: "CRM_PROJECTS_CREATE",
  CRM_PROJECTS_EDIT: "CRM_PROJECTS_EDIT",
  CRM_PROJECTS_DELETE: "CRM_PROJECTS_DELETE",

  // Contracts
  CRM_CONTRACTS_LIST: "CRM_CONTRACTS_LIST",
  CRM_CONTRACTS_CREATE: "CRM_CONTRACTS_CREATE",
  CRM_CONTRACTS_EDIT: "CRM_CONTRACTS_EDIT",
  CRM_CONTRACTS_DELETE: "CRM_CONTRACTS_DELETE",

  // Servicos
  CRM_SERVICES_LIST: "CRM_SERVICES_LIST",
  CRM_SERVICES_CREATE: "CRM_SERVICES_CREATE",
  CRM_SERVICES_EDIT: "CRM_SERVICES_EDIT",
  CRM_SERVICES_DELETE: "CRM_SERVICES_DELETE",
};

const TRAININGS_EVENTS = {
  TRAININGS_LIST: "TRAININGS_LIST",
  TRAININGS_CREATED: "TRAININGS_CREATED",
  TRAININGS_DELETED: "TRAININGS_DELETED",
  TRAININGS_UPDATED: "TRAININGS_UPDATED",

  // Treinamentos do usuário
  TRAININGS_USER_LIST: "TRAININGS_USER_LIST",
  TRAININGS_USER_CREATED: "TRAININGS_USER_CREATED",
  TRAININGS_USER_DELETED: "TRAININGS_USER_DELETED",
  TRAININGS_USER_UPDATED: "TRAININGS_USER_UPDATED",

  // Certificados do treinamento do usuário
  TRAININGS_USER_CERTIFICATES_LIST: "TRAININGS_USER_CERTIFICATES_LIST",
  TRAININGS_USER_CERTIFICATES_CREATED: "TRAININGS_USER_CERTIFICATES_CREATED",
  TRAININGS_USER_CERTIFICATES_DELETED: "TRAININGS_USER_CERTIFICATES_DELETED",

  // Escolas
  TRAININGS_SCHOOL_LIST: "TRAININGS_SCHOOL_LIST",
  TRAININGS_SCHOOL_CREATED: "TRAININGS_SCHOOL_CREATED",
  TRAININGS_SCHOOL_DELETED: "TRAININGS_SCHOOL_DELETED",
  TRAININGS_SCHOOL_UPDATED: "TRAININGS_SCHOOL_UPDATED",

  // Matriz
  TRAININGS_MATRIX_LIST: "TRAININGS_MATRIX_LIST",
};

const COMPANY_EVENTS = {
  // EMPRESAS
  COMPANY_LIST: "COMPANY_LIST",
  COMPANY_CREATED: "COMPANY_CREATED",
  COMPANY_UPDATED: "COMPANY_UPDATED",

  // USUARIOS
  COMPANY_USERS_LIST: "COMPANY_USERS_LIST",
  COMPANY_USERS_CREATED: "COMPANY_USERS_CREATED",
  COMPANY_USERS_DELETED: "COMPANY_USERS_DELETED",
  COMPANY_USERS_UPDATED: "COMPANY_USERS_UPDATED",
  COMPANY_USERS_CHANGE_PASSWORD: "COMPANY_USERS_CHANGE_PASSWORD",

  // Cargos
  COMPANY_ROLES_LIST: "COMPANY_ROLES_LIST",
  COMPANY_ROLES_CREATED: "COMPANY_ROLES_CREATED",
  COMPANY_ROLES_DELETED: "COMPANY_ROLES_DELETED",
  COMPANY_ROLES_UPDATED: "COMPANY_ROLES_UPDATED",

  // Avisos
  COMPANY_WARNINGS_LIST: "COMPANY_WARNINGS_LIST",
  COMPANY_WARNINGS_CREATED: "COMPANY_WARNINGS_CREATED",

  // Blog
  COMPANY_BLOG_CATEGORIES_LIST: "COMPANY_BLOG_CATEGORIES_LIST",
  COMPANY_BLOG_CATEGORIES_CREATED: "COMPANY_BLOG_CATEGORIES_CREATED",
  COMPANY_BLOG_CATEGORIES_DELETED: "COMPANY_BLOG_CATEGORIES_DELETED",
  COMPANY_BLOG_CATEGORIES_UPDATED: "COMPANY_BLOG_CATEGORIES_UPDATED",

  COMPANY_BLOG_LIST: "COMPANY_BLOG_LIST",
  COMPANY_BLOG_CREATED: "COMPANY_BLOG_CREATED",
  COMPANY_BLOG_DELETED: "COMPANY_BLOG_DELETED",
  COMPANY_BLOG_UPDATED: "COMPANY_BLOG_CATEGORIES_UPDATED",

  COMPANY_MONITORING_LIST: "COMPANY_MONITORING_LIST",
};

export const AUDIT_EVENTS = {
  ...DOCUMENTS_EVENTS,
  ...TASKS_EVENTS,
  ...EQUIPMENT_EVENTS,
  ...INDICATORS_EVENTS,
  ...CRM_SERVICES_EVENTS,
  ...TRAININGS_EVENTS,
  ...COMPANY_EVENTS,
  ...USER_EVENTS,
};
