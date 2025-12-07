import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: Number(process.env.TYPEORM_PORT) || 3306,
      username: process.env.TYPEORM_USERNAME || 'mysqluser',
      password: process.env.TYPEORM_PASSWORD || 'mysqlpassword',
      database:
        process.env.TYPEORM_DATABASE || 'mydadv-course-nestjs-cqrs-demo',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      logging: ['query', 'error'],
      // Remove 'cli' and 'migrationsRun' - not in TypeORM 0.3
    };
  }
}
