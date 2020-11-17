import { EntityRepository, Repository } from 'typeorm';
import { PhotoGymClass } from './photo-gymclass.entity';
import { ImageSize } from '../shared/image-size.enum';
import { Dictionary } from 'lodash';

@EntityRepository(PhotoGymClass)
export class PhotoGymClassRepository extends Repository<PhotoGymClass> {
    
    async saveAwsKeys(imageKeysDict: Dictionary<string>): Promise<PhotoGymClass> {
        
        const photo = new PhotoGymClass();
        photo.smallImageKey = imageKeysDict[ImageSize.SMALL];
        photo.mediumImageKey = imageKeysDict[ImageSize.MEDIUM];
        photo.largeImageKey = imageKeysDict[ImageSize.LARGE];

        await photo.save();

        return photo
    }
}