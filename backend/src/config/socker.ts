import { Server } from "socket.io";
import { frontendUrl } from "../lib/getUrl";
import { Server as HttpServer } from "http";
import { verifyAccessToken } from "../lib/token";

const onlineUser = new Map();

export async function setUpSocketIo(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: `${frontendUrl()}`,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.accessToken;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = verifyAccessToken(token);

      if (!payload) {
        return next(new Error("User not found"));
      }

      socket.data.userId = payload.sub;
      next();
    } catch (error) {
      next(new Error("Internal Server Error"));
    }
  });

  io.on("connection", (socket) => {
    const UserId = socket.data.userId;

    socket.join(UserId);
    console.log(`User connected: ${UserId} `);
  });

  return io;
}
