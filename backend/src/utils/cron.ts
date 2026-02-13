import cron from "node-cron";
import { Story } from "../model/post/story.model";
import { deleteObjectSugnedUrl } from "../lib/presignedUrl";

cron.schedule("*/5 * * * *", async () => {
  console.log("Running story cleaner...");

  const expiredStories = await Story.find({
    createdAt: {
      $it: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  for (const story of expiredStories) {
    await deleteObjectSugnedUrl(story.mediaKey);

    await story.deleteOne();
  }

  console.log(`Deleted ${expiredStories.length} expired stories`);
});
