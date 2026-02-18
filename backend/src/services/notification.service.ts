import { Notification } from "../model/notification.model";
import { Profile } from "../model/profile.model";

type NotificationType =
  | "STORY_REACTION"
  | "FOLLOWED"
  | "POST_COMMENT"
  | "POST_LIKE"
  | "COMMENT_REPLY"
  | "COMMENT_LIKE";

type EntityModel = "Post" | "Comment" | "Story" | "Profile";

function buildNotificationMessage(
  type: NotificationType,
  senderUserName: string,
  extraText?: string,
  model?: EntityModel,
) {
  switch (type) {
    case "COMMENT_LIKE":
      return `${senderUserName}: liked your comment: "${extraText}"`;

    case "FOLLOWED":
      return `${senderUserName}: started follwoing you`;

    case "POST_LIKE":
      return `${senderUserName}: liked your post`;

    case "POST_COMMENT":
      return `${senderUserName}: commented ${extraText} to your ${model}`;

    case "STORY_REACTION":
      return `${senderUserName}: reacted ${extraText} in your story`;

    case "COMMENT_REPLY":
      return `${senderUserName}: replyed ${extraText} to your comment`;

    default:
      return "empty data";
  }
}

export async function createNotification({
  receiptId,
  senderId,
  type,
  entityId,
  entityModel,
  extraText,
}: {
  receiptId: string;
  senderId: string;
  type: NotificationType;
  entityId: string;
  entityModel: EntityModel;
  extraText?: string;
}) {
  const sender = await Profile.findById(senderId).select("avatar userName");

  if (!sender) return;

  if (receiptId === senderId) return;

  const message = buildNotificationMessage(
    type,
    sender.userName,
    extraText,
    entityModel,
  );

  const data = await Notification.create({
    receipt: receiptId,
    sender: senderId,
    type,
    message: message,
    entityId,
    entityModel,
  });

  return data;
}

export async function removeNotification({
  senderId,
  receiptId,
  type,
  entityId,
}: {
  senderId: string;
  receiptId: string;
  type: NotificationType;
  entityId?: string;
}) {
  return await Notification.findOneAndDelete({
    receipt: receiptId,
    sender: senderId,
    type,
    entityId,
  });
}
