import { api } from "api/api";
import { AUDIT_EVENTS } from "constants/audit-events";
import { toast } from "react-toastify";

export const getReminders = async (token, id, page = 1, search = "") => {
  const response = await api.get(
    `/reminders/${id}?search=${search}&page=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.status === 200) {
    return response.data;
  }
};

export const createReminder = async (data, token) => {
  const response = await api.post(`/reminders`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_REMINDER_CREATED,
    },
    data: {
      ...data,
    },
  });
  if (response.status === 201) {
    return response.data;
  }
};

export const deleteReminder = async (
  id,
  token,
  setReminders,
  reminders,
  withoutToast = false
) => {
  const response = await api.delete(`/reminders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_REMINDER_DELETED,
    },
  });
  if (response.status === 200) {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
    if (!withoutToast) {
      toast.success("Lembrete excluído com sucesso!");
    }
  }
};

export const deleteMultipleDocumentReminders = async (
  selectedItems,
  token,
  setReminders,
  reminders
) => {
  const deletePromises = selectedItems.map((selected) =>
    selected.id !== "checkall"
      ? deleteReminder(selected.id, token, setReminders, reminders)
      : () => {}
  );
  await Promise.all(deletePromises);

  setReminders(
    reminders.filter(
      (reminder) =>
        !selectedItems.some((selected) => selected.id === reminder.id)
    )
  );

  toast.success("Lembretes excluídas com sucesso!");
};

export const updateReminder = async (data, token, setReminders, reminders) => {
  const response = await api.patch(`/reminders/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-audit-event": AUDIT_EVENTS.TASKS_DETAILS_REMINDER_UPDATED,
    },
  });

  if (response.status === 200) {
    toast.success("Lembrete atualizado com sucesso!");
    setReminders(
      reminders.map((reminder) =>
        reminder.id === data.id ? { ...data } : reminder
      )
    );
    return response.data;
  }
};
