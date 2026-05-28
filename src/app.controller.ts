import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  // ESP32 calls this
  @Get('ring')
  async ring(): Promise<string> {
    return await this.appService.ring();
  }

  // Flutter app calls this to register its token
  @Post('addToken')
  @HttpCode(200)
  addToken(@Body('token') token: string, @Body('uuid') uuid: string): string {
    
    this.appService.addToken(token);
    const resp = {
      message: 'Ok'
    }

    console.log("added token for uuid ", uuid)
    return JSON.stringify(resp);
  }
}
