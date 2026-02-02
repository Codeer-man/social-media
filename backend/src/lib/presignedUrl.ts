import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3client } from "../config/s3";

export const putObjectSignedUrl = async (key: string, contentType: string) => {
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_IMAGE_NAME!;
  const endpoint = process.env.AWS_ENDPOINT_URL_S3!;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3client, command, {
    expiresIn: 360,
  });

  const cleanEndpoint = endpoint.replace(/^https?:\/\//, "");
  const fileUrl = `https://${bucket}.${cleanEndpoint}/${key}`;

  return { uploadUrl, fileUrl };
};

export const deleteObjectSugnedUrl = async (key: string) => {
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_IMAGE_NAME!;

  if (!key) throw new Error("S3 key is required");

  const command = new DeleteObjectCommand({
    Key: key,
    Bucket: bucket,
  });

  return await s3client.send(command);
};
