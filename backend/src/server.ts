import app from "./app";
import http from "http";
import connectToDB from "./config/db";
import { setUpSocketIo } from "./config/socker";

const PORT = process.env.PORT;

async function startServer() {
  await connectToDB();

  const server = http.createServer(app);

  // socket
  setUpSocketIo(server);

  server.listen(PORT, () => {
    console.log(`Server running in port http://localhost:${PORT}`);
    console.log("socker is ready");
  });
}

startServer().catch((err) => {
  console.error("Error while connecting to the server", err);
  process.exit(1);
});
