import { api } from "api/api";

export const getRevisions = async (
  page = 1,
  search = "",
  setRevisions,
  token
) => {
  const res = await api.get(
    `/document-revisions/company/revisions?page=${page}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.status === 200) {
    return res.data;
  }
};
