import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3client } from "../config/s3";

export const putObjectSignedUrl = async (
  key: string,
  contentType: string,
  folder: string,
  fileName: string
) => {
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

  //   const fileUrl = `https://${bucket}.${endpoint.replace(
  //     /^https?:\/\//,
  //     ""
  //   )}/${key}`;
  const cleanEndpoint = endpoint.replace(/^https?:\/\//, "");
  const fileUrl = `https://${bucket}.${cleanEndpoint}/${key}`;

  return { uploadUrl, fileUrl };
};
