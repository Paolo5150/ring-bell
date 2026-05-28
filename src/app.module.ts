import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FilesModule } from './azuretest/FilesModule';
import { ConfigModule } from '@nestjs/config';
import { WsService } from './camera/WsService';
import { CameraService } from './camera/camera.service';
import { CameraController } from './camera/camera.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FilesModule    
  ],
  controllers: [
    AppController,
    CameraController
  ],
  providers: [
    AppService,
    WsService,
    CameraService
  ],
})
export class AppModule {}