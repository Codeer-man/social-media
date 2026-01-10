import app from "./app";
import http from "http";

const PORT = process.env.PORT;

async function startServer() {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running in port http://${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error while connecting to the server", err);
  process.exit(1);
});
