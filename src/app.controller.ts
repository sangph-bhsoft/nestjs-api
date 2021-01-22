import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getH(): string {
    return this.appService.getHello();
  }

  @Get('uploads/images/products/:image')
  async serveImage(@Param('image') image, @Res() res): Promise<any> {
    res.sendFile(image, { root: 'uploads/images/products/' });
  }

  @Get('uploads/images/category/:image')
  async serveImageProduct(@Param('image') image, @Res() res): Promise<any> {
    res.sendFile(image, { root: 'uploads/images/category/' });
  }
}
