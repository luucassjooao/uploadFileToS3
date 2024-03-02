import parser from 'lambda-multipart-parser';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'node:crypto';

import { response } from './response.js';

export async function handler(event) {
  const { files: [file] } = await parser.parse(event);

  if(!file || file.fieldname !== 'file') {
    return response(400, {
      error: 'File is required.'
    })
  }
  
  if (file.contentType !== 'image/png') {
    return response(400, {
      error: 'Only png files are accepted.'
    })
  }

  const s3Client = new S3Client({ region: 'us-east-1' });
  const command = new PutObjectCommand({
    Bucket: 'uploadfile01',
    Key: `uploads/${crypto.randomUUID()}-${file.filename}`,
    Body: file.content
  });

  await s3Client.send(command);

  return response(204, {});
}