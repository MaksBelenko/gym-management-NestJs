import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const uploadImageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(
            new BadRequestException('Only image files are allowed (jpg|jpeg|png|gif)!',),
            false,
        );
    }
    callback(null, true);
};

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };
