import app from "./app";
import http from "http";
import connectToDB from "./config/db";

const PORT = process.env.PORT;

async function startServer() {
  await connectToDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running in port http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error while connecting to the server", err);
  process.exit(1);
});
