import { AUDIT_EVENTS } from "constants/audit-events";
import { toast } from "react-toastify";

const { api } = require("api/api");

export const getDepartamentPermissions = async (
  documentId,
  setDepartamentPermissions
) => {
  const response = await api.get(`departaments-permissions/${documentId}`);
  if (response.status === 200) {
    setDepartamentPermissions(response.data);
  }
};

export const addDepartamentsPermissions = async (
  documentId,
  departaments,
  departamentPermissions,
  setDepartamentPermissions,
  token
) => {
  const response = await api.post(
    "departaments-permissions/",
    {
      departaments: departaments.map((departament) => departament.value),
      isAuthorized: true,
      documentId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-audit-event":
          AUDIT_EVENTS.DOCUMENTS_DETAILS_ADD_DEPARTAMENT_PERMISSION,
      },
    }
  );

  if (response.status === 201) {
    setDepartamentPermissions([...departamentPermissions, ...response.data]);
  }
};

export const removeDepartamentsPermissions = async (
  departamentsId,
  departamentPermissions,
  setDepartamentPermissions,
  token
) => {
  const response = await api.delete(
    `departaments-permissions/${departamentsId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-audit-event":
          AUDIT_EVENTS.DOCUMENTS_DETAILS_DELETE_DEPARTAMENT_PERMISSION,
      },
    }
  );

  if (response.status === 200) {
    setDepartamentPermissions(
      departamentPermissions.filter(
        (departamentPermission) =>
          departamentPermission.departamentId !== response.data.departamentId
      )
    );
    toast.success("Permissão removida com sucesso");
  }
};

export const removeMultipleDepartamentsPermissions = async (
  departamentsIds,
  departamentPermissions,
  setDepartamentPermissions,
  token
) => {
  const promises = departamentsIds.map((selected) => {
    if (selected.id !== "checkall") {
      return api.delete(`/departaments-permissions/${selected.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-audit-event":
            AUDIT_EVENTS.DOCUMENTS_DETAILS_DELETE_DEPARTAMENT_PERMISSION,
        },
      });
    }
    return null;
  });
  await Promise.all(promises);

  const filteredRelatedDocuments = departamentPermissions.filter(
    (relatedDocument) =>
      !departamentsIds.some((selected) => relatedDocument.id === selected.id)
  );

  setDepartamentPermissions(filteredRelatedDocuments);
  toast.success("Permissões removidas com sucesso");
};

export const columns = [
  { header: "Departamento", access: "departamentName" },
  {
    header: "Autorizado",
    access: "isAuthorized",
    formatData: (data) => (data ? "Sim" : "Não"),
  },
];
