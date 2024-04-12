const format = (n) => (n ? 1 : 0);

export const getCheckBoxes = (getChecked) => {
  return {
    documents: {
      canAdd: format(getChecked),
      canRead: format(getChecked),
      canDelete: format(getChecked),
      canEdit: format(getChecked),
    },
    tasks: {
      canAdd: format(getChecked),
      canRead: format(getChecked),
      canDelete: format(getChecked),
      canEdit: format(getChecked),
    },
    equipments: {
      canAdd: format(getChecked),
      canRead: format(getChecked),
      canDelete: format(getChecked),
      canEdit: format(getChecked),
    },
    indicators: {
      canAdd: format(getChecked),
      canRead: format(getChecked),
      canDelete: format(getChecked),
      canEdit: format(getChecked),
    },
    crm: {
      canAdd: format(getChecked),
      canRead: format(getChecked),
      canDelete: format(getChecked),
      canEdit: format(getChecked),
    },
    training: {
      canAdd: format(getChecked),
      canRead: format(getChecked),
      canDelete: format(getChecked),
      canEdit: format(getChecked),
    },
    companies: {
      canAdd: format(getChecked),
      canRead: format(getChecked),
      canDelete: format(getChecked),
      canEdit: format(getChecked),
    },
  };
};
