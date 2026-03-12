import { Server } from "socket.io";
import { frontendUrl } from "../lib/getUrl";
import { get, Server as HttpServer } from "http";
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
    const userId = socket.data.userId;

    socket.join(userId);

    if (!onlineUser.has(userId)) {
      onlineUser.set(userId, new Set());
    }
    onlineUser.get(userId).add(socket.id);

    socket.broadcast.emit("user_online", { userId });

    socket.on("join", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} join the conversation ${conversationId}`);
    });

    socket.on("leave", (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${userId} leaved the conversation ${conversationId}`);
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit("user_typing", {
        userId,
        isTyping,
      });
    });

    socket.on("check_online", (targetUserId, callback) => {
      const isOnline =
        onlineUser.has(targetUserId) && onlineUser.get(targetUserId).size > 0;

      if (callback) callback({ userId: targetUserId, isOnline });
    });

    socket.on("disconnected", () => {
      console.log(`User disconnected:${userId}`);

      if (onlineUser.has(userId)) {
        onlineUser.get(userId).delete(socket.id);

        if (onlineUser.get(userId).size === 0) {
          onlineUser.delete(userId);

          socket.broadcast.emit("User offline", { userId });
        }
      }
    });
  });

  return io;
}

export function isUserOnline(userId: string) {
  return onlineUser.has(userId) && onlineUser.get(userId).size > 0;
}
