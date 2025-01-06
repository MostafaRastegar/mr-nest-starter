import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadPath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      file.originalname,
    );

    // Ensure the uploads directory exists
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });

    // Save the file
    await fs.writeFile(uploadPath, file.buffer);

    return `File uploaded to ${uploadPath}`;
  }
}
