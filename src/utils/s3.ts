import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class S3Utils {
  private s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  createSignedUrl(key: string, contentType: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        ContentType: contentType,
      });
      return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  uploadFile(file: Buffer, key: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file,
      });
      return this.s3Client.send(command);
    } catch (error: any) {
      console.error(error);
    }
  }

  deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      });
      return this.s3Client.send(command);
    } catch (error: any) {
      console.error(error);
    }
  }

  getFile(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      });
      return this.s3Client.send(command);
    } catch (error: any) {
      console.error(error);
    }
  }

  moveFile(sourceKey: string, destinationKey: string) {
    try {
      const encodedSourceKey = sourceKey.split('/').map(encodeURIComponent).join('/');
      const command = new CopyObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        CopySource: `${process.env.AWS_S3_BUCKET}/${encodedSourceKey}`,
        Key: destinationKey,
      });
      return this.s3Client.send(command);
    } catch (error: any) {
      console.error(error);
    }
  }
}

export default new S3Utils();
