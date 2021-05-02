import { Test } from '@nestjs/testing';
import { GymClassesService } from '../gym-classes.service';
import { GymClassRepository } from '../gym-class.repository';
import { GetFilteredGymClassesDto } from '../dto/get-filtered-gym-classes.dto';
import { PhotosService } from '../../../shared-modules/photos/photos.service';

const mockGymClassRepository = () => ({
    getGymClasses: jest.fn(),
    getGymClassById: jest.fn(),
});
const mockPhotoService = () => ({
});

describe('GymClassesService', () => {
    let gymClassService: GymClassesService;
    let gymClassRepository;
    let photoService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                GymClassesService,
                {
                    provide: GymClassRepository,
                    useFactory: mockGymClassRepository,
                },
                {
                    provide: PhotosService,
                    useFactory: mockPhotoService,
                }
            ],
        }).compile();

        gymClassService = await module.get(GymClassesService);
        gymClassRepository = module.get(GymClassRepository);
        photoService = module.get(PhotosService);

    });

    describe('getGymClasses', () => {
        it('should get all tasks from repository', async () => {
            gymClassRepository.getGymClasses.mockResolvedValue('somevalue');

            expect(gymClassRepository.getGymClasses).not.toHaveBeenCalled();

            const filterDto: GetFilteredGymClassesDto = { search: 'test search'};
            const result = await gymClassService.getGymClasses(filterDto);

            expect(gymClassRepository.getGymClasses).toHaveBeenCalled();
            expect(result).toEqual('somevalue');
        });
    });

    describe('getGymClassById', () => {
        it('should get single gym class by id', async () => {
            const mockGymClass = { name: 'Test name', description: 'Test description' };
            gymClassRepository.getGymClassById.mockResolvedValue(mockGymClass);

            const mockID = 'test_id';
            const result = await gymClassService.getGymClassById(mockID);
            expect(result).toEqual(mockGymClass);

            expect(gymClassRepository.getGymClassById).toHaveBeenCalledWith(mockID);
        });

        it('throws as gym class with id not found ', () => {
            gymClassRepository.getGymClassById.mockResolvedValue(null);
            expect(gymClassService.getGymClassById('test_id')).rejects.toThrow();
        });
    });
});
