import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import { CameraService } from './camera.service'
import { Server } from 'http';
@Injectable()
export class WsService {
    private wss: WebSocketServer;
    private streamers: Map<string, any> = new Map();
    private clients: Set<any> = new Set();

    constructor(private readonly cameraService: CameraService) {}

    init(server: Server) {

        this.wss = new WebSocketServer({ server });

        this.wss.on('connection', (ws) => {
            console.log('WS Client connected');

            ws.on('close', () => {
                console.log('Someone disconnected');

                for (const [key, socket] of this.streamers) {
                    if (socket === ws) {
                        this.streamers.delete(key);
                        break;
                    }
                }

                this.clients.delete(ws);
            });

            ws.on('message', (data, isBinary) => {

                if (!isBinary) {
                    const text = data.toString();

                    if (text === 'client') {
                        this.clients.add(ws);
                        this.cameraService.startStream();
                    }

                    if (this.cameraService.isCameraRegistered(text)) {
                        this.streamers.set(text, ws);
                        ws.send('WS: STREAM');
                    }

                    return;
                }

                // binary stream
                if (this.clients.size === 0) {
                    this.cameraService.stopStream();
                    ws.send('WS: STREAM STOP');
                    return;
                }

                for (const client of this.clients) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(data);
                    }
                }
            });

            ws.send('hello from server');
        });

        console.log('WebSocket attached to HTTP server');
    }
}