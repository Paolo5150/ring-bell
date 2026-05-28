import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CameraService {
    private m_cameras = new Set<string>()
    private m_streamRequested = false;

    registerCamera(deviceId: string, secret: string) {

        const cameraId = deviceId;

        const token = jwt.sign(
            {
                cameraId,
                type: 'camera',
            },
            'super_secret_key',
            {
                expiresIn: '30d',
            }
        );

        this.m_cameras.add(deviceId);
        console.log("Registered camera", deviceId);
        console.log("Total cameras registered: " + this.m_cameras.size)

        return {
            cameraId,
            token,
        };
    }

    isCameraRegistered(deviceId: string) {
        return this.m_cameras.has(deviceId);
    }

    stopStream() {
        this.m_streamRequested = false
    }

    startStream() {
        this.m_streamRequested = true
    }

    streamRequested() {
        return this.m_streamRequested;
    }
}