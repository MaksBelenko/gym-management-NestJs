import { Test } from '@nestjs/testing';
import { GymClassesService } from './gym-classes.service';
import { GymClassRepository } from './gym-class.repository';
import { GetFilteredGymClassesDto } from './dto/get-filtered-gym-classes.dto';

const mockGymClassRepository = () => ({
    getGymClasses: jest.fn(),
});

describe('GymClassesService', () => {
    let gymClassService: GymClassesService;
    let gymClassRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                GymClassesService,
                {
                    provide: GymClassRepository,
                    useFactory: mockGymClassRepository,
                },
            ],
        }).compile();

        gymClassService = await module.get(GymClassesService);
        gymClassRepository = module.get(GymClassRepository);
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
});
