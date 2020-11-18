import { EntityRepository, Repository } from 'typeorm';
import { PhotoGymClass } from './photo-gymclass.entity';
import { ImageSize } from '../shared/image-size.enum';
import { Dictionary } from 'lodash';
import { GymClass } from './gym-class.entity';

@EntityRepository(PhotoGymClass)
export class PhotoGymClassRepository extends Repository<PhotoGymClass> {
    
    async saveAwsKeys(imageKeysDict: Dictionary<string>, gymClass?: GymClass): Promise<PhotoGymClass> {
        
        const photo = new PhotoGymClass();
        photo.small = imageKeysDict[ImageSize.SMALL];
        photo.medium = imageKeysDict[ImageSize.MEDIUM];
        photo.large = imageKeysDict[ImageSize.LARGE];
        photo.gymClass = gymClass;

        return photo.save();
    }

    getAllImagesNames(photos: PhotoGymClass[]): string[] {
        let names: string[] = [];

        names.push.apply(names, photos.map(p => p.small));
        names.push.apply(names, photos.map(p => p.medium));
        names.push.apply(names, photos.map(p => p.large));

        return names;
    }

    async deletePhotos(photos: PhotoGymClass[]): Promise<void> {
        const ids = photos.map(p => p.id);

        await Promise.all( ids.map(async (id) => {
            await this.delete(id);
        }))
    }
}