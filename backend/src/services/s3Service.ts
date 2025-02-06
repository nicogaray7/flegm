import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import logger from '../config/logger';

class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = env.AWS_BUCKET_NAME;
  }

  public async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    try {
      const key = `${folder}/${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      logger.info(`File uploaded successfully to S3: ${key}`);

      return key;
    } catch (error) {
      logger.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file');
    }
  }

  public async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      logger.info(`File deleted successfully from S3: ${key}`);
    } catch (error) {
      logger.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file');
    }
  }

  public async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return signedUrl;
    } catch (error) {
      logger.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  public async uploadProfilePicture(file: Express.Multer.File, userId: string): Promise<string> {
    return this.uploadFile(file, `profile-pictures/${userId}`);
  }

  public async uploadDocument(file: Express.Multer.File, userId: string): Promise<string> {
    return this.uploadFile(file, `documents/${userId}`);
  }

  public getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }
}

export const s3Service = new S3Service();
