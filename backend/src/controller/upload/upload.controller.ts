import { Request, Response } from "express";
import { putObjectSignedUrl } from "../../lib/presignedUrl";

export async function uploadHanlder(req: Request, res: Response) {
  try {
    const { fileName, fileType, folder } = req.body;

    if (!fileName || !fileType || !folder) {
      return res.status(404).json({
        message: "FileName or fileType or folder is midding",
      });
    }

    const key = `${folder}/${Date.now()}-${fileName}`;

    const result = await putObjectSignedUrl(key, fileType, folder, fileName);

    return res.status(201).json({
      message: "Image uploaded",
      result: {
        uploadUrl: result.uploadUrl,
        fileUri: result.fileUrl,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}
