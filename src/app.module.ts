import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './shared/configuration/configuration.enum';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductModule } from './product/product.module';
// import { AuthModule } from './shared/auth/auth.module';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forRoot(ConfigurationService.connectionString),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    UserModule,
    CategoryModule,
    ProductModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static host: string;
  static port: string | number;
  static isDev: boolean;

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.host = _configurationService.get(Configuration.HOST);
    AppModule.isDev = _configurationService.isDevelopment;
    AppModule.port = AppModule.normalizePort(
      _configurationService.get(Configuration.PORT),
    );
  }

  private static normalizePort(param: string | number): number | string {
    const portNumber: number =
      typeof param === 'string' ? parseInt(param) : param;
    if (isNaN(portNumber)) return param;
    if (portNumber >= 0) return portNumber;
  }
}
