import { Module } from '@nestjs/common';

import { FilesController } from './FilesController';
import { FilesService } from './FilesService';

@Module({
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule {}