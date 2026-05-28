import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import { CameraService } from './camera.service'

@Injectable()
export class WsService implements OnModuleInit {
    private wss: WebSocketServer;
    private streamers: Map<string, WebSocket> = new Map();
    private clients: Set<WebSocket> = new Set();

    constructor(private readonly cameraService: CameraService) { }


    onModuleInit() {
        this.wss = new WebSocketServer({ port: 3001 });

        this.wss.on('connection', (ws) => {
            console.log('WS Client connected');
            ws.on('close', () => {
                console.log('Someone disconnected');

                for (const [key, ws] of this.streamers) {
                    if (ws === ws) {
                        this.streamers.delete(key);
                        console.log('Streamer disconnected');
                        break;
                    }
                }
                if (this.clients.delete(ws))
                    console.log('Client disconnected');
            });

            ws.on('message', (data, isBinary) => {
                if (!isBinary) {
                    const text = data.toString();

                    if (text === 'client') {
                        console.log('new client!')
                        this.clients.add(ws)
                        this.cameraService.startStream()

                    }
                    //Is it a device asking for streaming?
                    if (this.cameraService.isCameraRegistered(text)) {
                        //Valid, add websocket as client
                        this.streamers.set(text, ws);
                        ws.send('WS: STREAM');
                    }
                    return;
                }
                else {
                    console.log('Receiving stream')
                    if (this.clients.size == 0) {
                        this.cameraService.stopStream()
                        ws.send('WS: STREAM STOP');

                    }

                    for (const client of this.clients) {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(data);
                        }
                    }
                }



            });

            ws.send('hello from server');
        });

        console.log('WebSocket running on ws://localhost:3001');
    }
}