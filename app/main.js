const net = require("net");
const { RedisStore } = require("./src/redis-store");
const {
  encodeRespString,
  decodeDataBuffer,
  COMMAND,
  RESPONSE,
} = require("./src/parser");

// ? App constants
const HOST = "127.0.0.1";
const PORT = 6378;

const store = new RedisStore();
// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  connection.write(`s-redis:${PORT}>`);
  // Handle connection
  connection.on("data", (data) => {
    const [string, respArray] = decodeDataBuffer(data);
    console.log(`Received command:`, string, respArray);

    if (typeof respArray[0] != "string") throw new Error("Invalid message");

    if (respArray[0].toUpperCase() === COMMAND.PING)
      return connection.write(encodeRespString(RESPONSE.PONG));

    if (respArray[0].toUpperCase() === COMMAND.ECHO)
      return connection.write(encodeRespString(respArray[1] ?? ""));

    if (respArray[0].toUpperCase() === COMMAND.SET) {
      if (typeof respArray[1] != "string") throw new Error("Invalid KEY Type");
      if (!respArray[2]) throw new Error("value cannot be empty");
      if (typeof Number(respArray[3]) != "number")
        throw new Error("Invalid TTL");

      let ttl = 0;
      if (respArray[3]) {
        ttl = respArray[3];
      }
      store.set(respArray[1], respArray[2], ttl);
      console.log("store", store);
      return connection.write(encodeRespString("1"));
    }

    if (respArray[0].toUpperCase() === COMMAND.GET) {
      if (typeof respArray[1] != "string") throw new Error("Invalid KEY Type");

      return connection.write(encodeRespString(store.get(respArray[1])));
    }

    return connection.write(encodeRespString("Not a valid command"));
  });
});

server.listen(PORT, HOST, () => {
  console.log(`s-redis server started on ${HOST}:${PORT}`);
});
