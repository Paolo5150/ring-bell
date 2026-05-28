import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import serviceAccount from '../ringbell-43019-firebase-adminsdk-fbsvc-e31444e7b9.json';

@Injectable()
export class AppService {
  private initialized = false;
  private deviceTokens: string[] = []; // store all tokens

  constructor() {
    if (!this.initialized) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
      this.initialized = true;
    }
  }

  // Add device token (called by Flutter app)
  addToken(token: string) {
    if (!this.deviceTokens.includes(token)) {
      console.log("Added token")
      this.deviceTokens.push(token);
    }
  }

  // Called by ESP32
  async ring(): Promise<string> {

    console.log('Ring! Clients listenning: ', this.deviceTokens.length);
    for (const token of this.deviceTokens) {
      const msgId = await admin.messaging().send({
        token,
        android: { priority: 'high' },
        apns: { headers: { 'apns-priority': '10' } },
        notification: {
          title: 'Ring!',
          body: 'Someone is at the door!',
        },
        data: {
          title: 'Ring!',
          body: 'Someone is at the door!',
        },
      });

      console.log('Push sent, message ID:', msgId);
    }
    return 'Notification sent';
  }
}

