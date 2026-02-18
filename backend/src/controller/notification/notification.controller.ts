import { NextFunction, Request, Response } from "express";
import { Notification } from "../../model/notification.model";
import { User } from "../../model/user.model";

export async function getNotificationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authUser = (req as any).user;
  if (!authUser) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    const notificatoin = await Notification.find({ receipt: authUser.profile });
    console.log(authUser.profile);

    if (!notificatoin) {
      return res.status(201).json({
        message: "Notification is empty",
      });
    }

    return res.status(201).json({
      message: "Notification",
      data: notificatoin,
    });
  } catch (error) {
    next(error);
  }
}

export async function readNotificationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ message: "You are not authenticated" });
    }

    const notiId = req.params.notiId;
    if (!notiId) {
      return res.status(401).json({
        message: "Noti id is required",
      });
    }

    const noti = await Notification.findById(notiId);

    if (!noti) {
      return res.status(404).json({
        message: "notificatoin not found",
      });
    }

    if (noti.receipt.toString() !== authUser.profile) {
      return res.status(401).json({
        message: "You are not the author",
      });
    }

    noti.isRead = true;
    await noti.save();

    return res.status(201).json({
      message: "You have read the message",
      data: noti,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteReadNotificationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ message: "You are not authenticated" });
    }

    const noti = await Notification.deleteMany({
      receipt: authUser.Profile,
      isRead: true,
    });

    if (!noti) {
      return res.status(404).json({
        message: "notificatoin not found",
      });
    }

    return res.status(201).json({
      message: "You have delete the notification the read notification",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAllNotificationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ message: "You are not authenticated" });
    }

    const notiId = req.params.notiId;
    if (!notiId) {
      return res.status(401).json({
        message: "Noti id is required",
      });
    }

    const result = await Notification.deleteMany({
      recipient: authUser.profile,
    });

    return res.status(200).json({
      message: "All notifications deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
}
