import { NextFunction, Request, Response } from "express";
import { Profile } from "../../model/profile.model";
import { Message } from "../../model/message.model";

export async function sendMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user;

    if (!authUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { receiverId } = req.params;
    const { content, attachment } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (authUser.profile === receiverId) {
      return res
        .status(400)
        .json({ message: "You cannot send a message to yourself" });
    }

    const receiver = await Profile.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver profile not found" });
    }

    const isBlocked = receiver.blockedUsers.some(
      (user) => user._id.toString() === authUser.profile,
    );

    if (isBlocked) {
      return res.status(403).json({ message: "You are blocked by this user" });
    }

    const message = await Message.create({
      senderId: authUser.profile,
      receiverId,
      content,
      attachment: attachment || null,
    });

    return res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

export async function markMessageReadHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user;

    if (!authUser) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { senderId } = req.params;

    if (!senderId) {
      return res.status(400).json({
        message: "senderId is required",
      });
    }

    await Message.updateMany(
      {
        senderId: senderId,
        receiverId: authUser.profile,
        isRead: false,
      },
      {
        $set: { isRead: true, status: "seen" },
      },
    );

    return res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({
        message: "auth user is required",
      });
    }

    const userId = authUser.profile;
    const profileId = authUser.profile;

    const friendships = await Profile.findById(profileId)
      .populate({
        path: "following",
        select: "name avatar",
      })
      .select("following ");

    if (!friendships) {
      return;
    }

    const friendIds = friendships.following.map((f) => f._id);

    const allMessages = await Message.find({
      $or: [
        {
          senderId: userId,
          receiverId: friendIds,
        },
        {
          senderId: friendIds,
          receiverId: userId,
        },
      ],
    }).sort({ createdAt: -1 });

    const lastMessages = new Map();
    const unreadCounts = new Map();

    allMessages.forEach((msg) => {
      const partnerId =
        msg.senderId.toString() === userId
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!lastMessages.has(partnerId)) {
        lastMessages.set(partnerId, msg);
      }

      if (
        msg.senderId.toString() === partnerId &&
        msg.receiverId.toString() === userId &&
        !msg.isRead
      ) {
        unreadCounts.set(partnerId, (unreadCounts.get(partnerId) || 0) + 1);
      }
    });

    const conversations = friendships.following.map((friend) => ({
      friend,
      lastMessage: lastMessages.get(friend._id.toString()) || null,
      unreadCount: unreadCounts.get(friend._id.toString()) || 0,
    }));

    const sortedConversation = conversations.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt || new Date(0);
      const timeB = b.lastMessage?.createdAt || new Date(0);
      return timeB - timeA;
    });

    return res.json({ sortedConversation, message: "conversation" });
  } catch (error) {
    next(error);
  }
}

export async function listMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user;

    if (!authUser) {
      return res.status(401).json({ message: "Auth user is required" });
    }

    const userId = authUser.profile;
    const { otherUserId } = req.params;
    const { limit = "50", cursor } = req.query;

    const query: any = {
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor as string) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
}
