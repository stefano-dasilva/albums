const bufferToDataUrl = (buffer) => {
  const base64 = btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  return `data:image/jpeg;base64,${base64}`;
};
export default bufferToDataUrl