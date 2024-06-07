import { Buffer } from "buffer";

function arrayBufferToBase64(buffer) {
  const bufferObj = Buffer.from(buffer);
  return bufferObj.toString("base64");
}
const handlingFileToBase64 = async (file) => {
  const blob = await file.slice(0, file.size, file.type);
  const buffer = await new Response(blob).arrayBuffer();

  const base64 = arrayBufferToBase64(buffer);
  return {
    base: base64,
    name: file.name,
    type: file.type,
  };
};

const handlingMultipleFilesToBase64 = async (files) => {
  const filesTreated = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    filesTreated.push(await handlingFileToBase64(file));
  }
  return filesTreated;
};

export {
  arrayBufferToBase64,
  handlingFileToBase64,
  handlingMultipleFilesToBase64,
};
