export const sleep = (ms) => {
  console.log("Sleeping for " + ms + " ms");
  return new Promise((resolve) => setTimeout(resolve, ms));
};
