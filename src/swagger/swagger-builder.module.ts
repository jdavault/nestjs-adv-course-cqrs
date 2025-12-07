import { INestApplication, Type } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerOptions {
  include?: Type<any>[];
  title?: string;
  description?: string;
  version?: string;
  path?: string;
}

export class SwaggerBuilderModule {
  static createSpec(app: INestApplication, options: SwaggerOptions = {}) {
    const {
      include = [],
      title = 'User API',
      description = 'CQRS-based User Management API with REST and GraphQL endpoints',
      version = '1.0',
      path = 'api',
    } = options;

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag('users', 'User management operations')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: include.length > 0 ? include : undefined,
    });

    SwaggerModule.setup(path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    return document;
  }
}
