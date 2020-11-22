import { EntityRepository, Repository } from 'typeorm';
import { Dictionary } from 'lodash';
import { Photo } from './photo.entity';
import { ImageSize } from '../../shared/image-size.enum';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {
    
    async saveAwsKeys(imageKeysDict: Dictionary<string>): Promise<Photo> {
        
        const photo = new Photo();
        photo.small = imageKeysDict[ImageSize.SMALL];
        photo.medium = imageKeysDict[ImageSize.MEDIUM];
        photo.large = imageKeysDict[ImageSize.LARGE];

        return photo.save();
    }

    getAllImagesNames(photos: Photo[]): string[] {
        const names: string[] = [];

        names.push(...photos.map(p => p.small));
        names.push(...photos.map(p => p.medium));
        names.push(...photos.map(p => p.large));

        return names;
    }

    async deletePhotos(photos: Photo[]): Promise<void> {
        const ids = photos.map(p => p.id);

        await Promise.all( ids.map(async (id) => {
            await this.delete(id);
        }))
    }
}