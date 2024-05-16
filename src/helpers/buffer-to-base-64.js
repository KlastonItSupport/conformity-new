import { Buffer } from "buffer";

function arrayBufferToBase64(buffer) {
  const bufferObj = Buffer.from(buffer);
  return bufferObj.toString("base64");
}

export { arrayBufferToBase64 };
