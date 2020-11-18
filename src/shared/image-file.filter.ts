import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

const megaByte: number = 1024*1024;

const uploadImageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(
            new BadRequestException('Only image files are allowed (jpg|jpeg|png|gif)!'),
            false,
        );
    }
    callback(null, true);
};

const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageMulterOptions: MulterOptions = {
    // dest: './uploaded',
    storage: diskStorage({
        // destination: './uploads',
        filename: editFileName,
    }),
    fileFilter: uploadImageFileFilter,
    limits: {
        fileSize: 10 * megaByte, // 10MB
    },
};
