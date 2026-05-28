import { Body, Controller, Post } from '@nestjs/common';
import { CameraService } from './camera.service'

@Controller('camera')
export class CameraController {

    constructor(private readonly cameraService: CameraService) {}

    @Post('register')
    register(@Body() body: any) {

        console.log('Registration request' + JSON.stringify(body))
        const result = this.cameraService.registerCamera(
            body.deviceId,
            body.secret
        );

        
        return {
            cameraId: result.cameraId,
            token: result.token
        };
    }

     @Post('checkstream')
    checkStream(@Body() body: any) {

        return this.cameraService.streamRequested();
    }

  
}