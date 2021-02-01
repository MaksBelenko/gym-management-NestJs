import { typeOrmConfig } from '../config/typeorm.config';
import fs = require('fs');

const ormconfig = typeOrmConfig;
ormconfig['entities' as any] = ['dist/**/*.entity.{js,ts}'];
ormconfig['migrations' as any] = ['dist/migrations/*{.ts,.js}'];

fs.writeFileSync(
    'ormconfig.json', 
    JSON.stringify(typeOrmConfig, null, 2)
);
