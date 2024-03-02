import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { response } from './response.js';

export async function handler(event) {
  const { filename } = JSON.parse(event.body);

  if(!filename) {
    return response(400, {
      error: 'File is required.'
    })
  }

  const s3Client = new S3Client({ region: 'us-east-1' });
  const command = new GetObjectCommand({
    Bucket: 'uploadfile01',
    Key: `uploads/${filename}`,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return response(200, { url });
}