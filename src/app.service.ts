import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  private initialized = false;
  private deviceTokens: string[] = [];

  constructor() {
    if (!this.initialized) {

      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT as string
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      this.initialized = true;
    }
  }

  addToken(token: string) {
    if (!this.deviceTokens.includes(token)) {
      this.deviceTokens.push(token);
    }
  }

  async ring(): Promise<string> {

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

      console.log('Push sent:', msgId);
    }

    return 'Notification sent';
  }
}