const COMMAND = {
  PING: "PING",
  ECHO: "ECHO",
  SET: "SET",
  GET: "GET",
};

const RESPONSE = {
  PONG: "PONG",
};

const encodeRespString = (str) => `+${str.trim()}\r\n`;
const decodeDataBuffer = (dataBuffer) => {
  const string = dataBuffer.toString().trim();
  const respArray = string.split(" ");
  return [string, respArray];
};
module.exports = {
  encodeRespString,
  decodeDataBuffer,
  COMMAND,
  RESPONSE,
};
