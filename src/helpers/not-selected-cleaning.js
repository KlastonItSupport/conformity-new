export const notSelectedCleaning = (data) => {
  const notSelected = "not-selected" || "checkall";
  const keys = Object.keys(data);

  keys.forEach((key) => {
    if (data[key] === notSelected) {
      delete data[key];
    }
  });
};
